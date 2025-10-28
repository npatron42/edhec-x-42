import AsyncStorage from "@react-native-async-storage/async-storage"

// Clés de stockage
const STORAGE_KEYS = {
	USER_PROFILE: "@eco_refill_user_profile",
	USER_ANSWERS: "@eco_refill_user_answers",
	REFILL_HISTORY: "@eco_refill_history",
	IMPACT_STATS: "@eco_refill_impact",
	SELECTED_PRODUCTS: "@eco_refill_selected_products",
	REWARDS_STATE: "@eco_refill_rewards_state",
	THEME_PREF: "@eco_refill_theme_pref",
}

// Helpers Récompenses
export const getRewards = async () => {
	const profile = await getUserProfile()
	return (
		profile?.rewards || {
			points: 0,
			badges: [],
			discounts: [],
			streak: { count: 0, lastRefillAt: null },
		}
	)
}

export const addPoints = async (points) => {
	const profile = (await getUserProfile()) || {}
	const rewards = profile.rewards || {
		points: 0,
		badges: [],
		discounts: [],
		streak: { count: 0, lastRefillAt: null },
	}
	rewards.points += points
	await saveUserProfile({ ...profile, rewards })
	await AsyncStorage.setItem(
		STORAGE_KEYS.REWARDS_STATE,
		JSON.stringify(rewards),
	)
	return rewards.points
}

export const unlockBadge = async (badge) => {
	const profile = (await getUserProfile()) || {}
	const rewards = profile.rewards || {
		points: 0,
		badges: [],
		discounts: [],
		streak: { count: 0, lastRefillAt: null },
	}
	if (!rewards.badges.find((b) => b.id === badge.id)) {
		rewards.badges.push({ ...badge, unlockedAt: new Date().toISOString() })
	}
	await saveUserProfile({ ...profile, rewards })
	await AsyncStorage.setItem(
		STORAGE_KEYS.REWARDS_STATE,
		JSON.stringify(rewards),
	)
	return rewards.badges
}

export const addDiscount = async (discount) => {
	const profile = (await getUserProfile()) || {}
	const rewards = profile.rewards || {
		points: 0,
		badges: [],
		discounts: [],
		streak: { count: 0, lastRefillAt: null },
	}
	rewards.discounts.push({
		...discount,
		used: false,
		grantedAt: new Date().toISOString(),
	})
	await saveUserProfile({ ...profile, rewards })
	await AsyncStorage.setItem(
		STORAGE_KEYS.REWARDS_STATE,
		JSON.stringify(rewards),
	)
	return rewards.discounts
}

export const redeemDiscount = async (discountId) => {
	const profile = (await getUserProfile()) || {}
	const rewards = profile.rewards || {
		points: 0,
		badges: [],
		discounts: [],
		streak: { count: 0, lastRefillAt: null },
	}
	const idx = (rewards.discounts || []).findIndex(
		(d) => d.id === discountId && !d.used,
	)
	if (idx >= 0) {
		rewards.discounts[idx] = {
			...rewards.discounts[idx],
			used: true,
			usedAt: new Date().toISOString(),
		}
		await saveUserProfile({ ...profile, rewards })
		await AsyncStorage.setItem(
			STORAGE_KEYS.REWARDS_STATE,
			JSON.stringify(rewards),
		)
		return true
	}
	return false
}

const daysBetween = (d1, d2) =>
	Math.abs(
		(new Date(d1).setHours(0, 0, 0, 0) -
			new Date(d2).setHours(0, 0, 0, 0)) /
			(1000 * 60 * 60 * 24),
	)

const evaluateBadges = async (stats) => {
	const profile = (await getUserProfile()) || {}
	const rewards = profile.rewards || {
		points: 0,
		badges: [],
		discounts: [],
		streak: { count: 0, lastRefillAt: null },
	}

	// Refill streak (within 7-day windows)
	const now = new Date()
	if (rewards.streak?.lastRefillAt) {
		const diff = daysBetween(now, rewards.streak.lastRefillAt)
		if (diff <= 7) rewards.streak.count = (rewards.streak.count || 0) + 1
		else rewards.streak.count = 1
	} else {
		rewards.streak = { count: 1, lastRefillAt: now.toISOString() }
	}
	rewards.streak.lastRefillAt = now.toISOString()

	// Threshold badges
	const push = (id, name, icon) => {
		if (!rewards.badges.find((b) => b.id === id))
			rewards.badges.push({
				id,
				name,
				icon,
				unlockedAt: new Date().toISOString(),
			})
	}

	if (stats.totalRefills >= 1) push("first_refill", "Premier pas", "🌱")
	if (stats.totalRefills >= 5) push("refill_5", "5 recharges", "🥉")
	if (stats.totalRefills >= 10) push("refill_10", "10 recharges", "🥈")
	if (stats.totalRefills >= 20) push("refill_20", "20 recharges", "🥇")

	if (rewards.streak.count >= 3) push("streak_3", "Série de 3", "🔥")
	if (rewards.streak.count >= 5) push("streak_5", "Série de 5", "⚡")

	const co2 = stats.co2Saved || 0
	if (co2 >= 1) push("co2_1", "1 kg CO₂ évité", "🌍")
	if (co2 >= 5) push("co2_5", "5 kg CO₂ évités", "🌎")
	if (co2 >= 10) push("co2_10", "10 kg CO₂ évités", "🌏")

	await saveUserProfile({ ...profile, rewards })
	await AsyncStorage.setItem(
		STORAGE_KEYS.REWARDS_STATE,
		JSON.stringify(rewards),
	)
	return rewards
}

// Sauvegarder les réponses du questionnaire
export const saveUserAnswers = async (answers) => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEYS.USER_ANSWERS,
			JSON.stringify(answers),
		)
		return true
	} catch (error) {
		console.error("Erreur lors de la sauvegarde des réponses:", error)
		return false
	}
}

// Récupérer les réponses du questionnaire
export const getUserAnswers = async () => {
	try {
		const answers = await AsyncStorage.getItem(STORAGE_KEYS.USER_ANSWERS)
		return answers ? JSON.parse(answers) : null
	} catch (error) {
		console.error("Erreur lors de la récupération des réponses:", error)
		return null
	}
}

// Sauvegarder les produits sélectionnés
export const saveSelectedProducts = async (products) => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEYS.SELECTED_PRODUCTS,
			JSON.stringify(products),
		)
		return true
	} catch (error) {
		console.error("Erreur lors de la sauvegarde des produits:", error)
		return false
	}
}

// Récupérer les produits sélectionnés
export const getSelectedProducts = async () => {
	try {
		const products = await AsyncStorage.getItem(
			STORAGE_KEYS.SELECTED_PRODUCTS,
		)
		return products ? JSON.parse(products) : []
	} catch (error) {
		console.error("Erreur lors de la récupération des produits:", error)
		return []
	}
}

// Ajouter une recharge à l'historique
export const addRefillToHistory = async (refill) => {
	try {
		const history = await getRefillHistory()
		const newRefill = {
			...refill,
			date: new Date().toISOString(),
			id: Date.now().toString(),
		}
		history.unshift(newRefill)
		await AsyncStorage.setItem(
			STORAGE_KEYS.REFILL_HISTORY,
			JSON.stringify(history),
		)

		// Mettre à jour les statistiques d'impact
		const stats = await updateImpactStats(refill.products)

		// Récompenses basées sur l'usage
		await addPoints(10) // 10 pts par recharge
		await evaluateBadges(stats)
		if (stats.totalRefills % 5 === 0)
			await addDiscount({
				id: `DISC-${stats.totalRefills}`,
				label: `-${Math.min(
					5 + stats.totalRefills / 5,
					20,
				)}% sur votre prochaine recharge`,
				value: Math.min(5 + stats.totalRefills / 5, 20),
			})

		return true
	} catch (error) {
		console.error("Erreur lors de l'ajout de la recharge:", error)
		return false
	}
}

// Récupérer l'historique des recharges
export const getRefillHistory = async () => {
	try {
		const history = await AsyncStorage.getItem(STORAGE_KEYS.REFILL_HISTORY)
		return history ? JSON.parse(history) : []
	} catch (error) {
		console.error("Erreur lors de la récupération de l'historique:", error)
		return []
	}
}

// Mettre à jour les statistiques d'impact
export const updateImpactStats = async (products) => {
	try {
		const stats = await getImpactStats()

		let totalCO2 = stats.co2Saved || 0
		let totalPlastic = stats.plasticSaved || 0
		let totalRefills = stats.totalRefills || 0
		let totalMoney = stats.moneySaved || 0

		const items = Array.isArray(products) ? products.filter(Boolean) : []

		// Helper pour estimer l'économie €/produit si les prix manquent
		const estimateSavings = (p) => {
			const regular =
				typeof p.priceRegular === "number" ? p.priceRegular : 8.0 // €
			const refill =
				typeof p.priceRefill === "number"
					? p.priceRefill
					: regular * 0.7 // -30%
			return Math.max(0, regular - refill)
		}

		items.forEach((product) => {
			totalCO2 += product.co2Saved || 0
			totalPlastic += product.plasticSaved || 0
			totalMoney += estimateSavings(product)
		})

		totalRefills += 1

		const newStats = {
			co2Saved: totalCO2,
			plasticSaved: totalPlastic,
			totalRefills,
			bottlesSaved: Math.floor(totalPlastic / 50), // 1 bouteille ≈ 50g
			moneySaved: parseFloat(totalMoney.toFixed(2)),
			lastUpdate: new Date().toISOString(),
		}

		await AsyncStorage.setItem(
			STORAGE_KEYS.IMPACT_STATS,
			JSON.stringify(newStats),
		)
		return newStats
	} catch (error) {
		console.error("Erreur lors de la mise à jour des stats:", error)
		return null
	}
}

// Récupérer les statistiques d'impact
export const getImpactStats = async () => {
	try {
		const stats = await AsyncStorage.getItem(STORAGE_KEYS.IMPACT_STATS)
		return stats
			? JSON.parse(stats)
			: {
					co2Saved: 0,
					plasticSaved: 0,
					totalRefills: 0,
					bottlesSaved: 0,
					moneySaved: 0,
			  }
	} catch (error) {
		console.error("Erreur lors de la récupération des stats:", error)
		return {
			co2Saved: 0,
			plasticSaved: 0,
			totalRefills: 0,
			bottlesSaved: 0,
			moneySaved: 0,
		}
	}
}

// Sauvegarder le profil utilisateur
export const saveUserProfile = async (profile) => {
	try {
		// Normaliser le schéma rewards
		const p = {
			...profile,
			rewards: profile.rewards || {
				points: 0,
				badges: [],
				discounts: [],
				streak: { count: 0, lastRefillAt: null },
			},
		}
		await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(p))
		return true
	} catch (error) {
		console.error("Erreur lors de la sauvegarde du profil:", error)
		return false
	}
}

// Récupérer le profil utilisateur
export const getUserProfile = async () => {
	try {
		const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE)
		return data ? JSON.parse(data) : null
	} catch (e) {
		console.error(
			"Erreur lors de la récupération du profil utilisateur:",
			e,
		)
		return null
	}
}

export const updateUserProfile = async (partial) => {
	const current = (await getUserProfile()) || {}
	const next = {
		...current,
		...partial,
		rewards: current.rewards || {
			points: 0,
			badges: [],
			discounts: [],
			streak: { count: 0, lastRefillAt: null },
		},
	}
	await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(next))
	return next
}

// Effacer toutes les données locales de l'application
export const clearAllData = async () => {
	try {
		await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS))
		return true
	} catch (e) {
		console.error("Erreur lors de la suppression des données locales:", e)
		return false
	}
}

export const signOutUser = async ({ clearAll = false } = {}) => {
	if (clearAll) return clearAllData()
	try {
		await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE)
		return true
	} catch (e) {
		return false
	}
}

// Préférences de thème
export const getThemePreference = async () => {
	try {
		const v = await AsyncStorage.getItem(STORAGE_KEYS.THEME_PREF)
		// 'light' | 'dark'
		return v === "dark" ? "dark" : "light"
	} catch (e) {
		return "light"
	}
}

export const setThemePreference = async (mode) => {
	try {
		const m = mode === "dark" ? "dark" : "light"
		await AsyncStorage.setItem(STORAGE_KEYS.THEME_PREF, m)
		return true
	} catch (e) {
		return false
	}
}
