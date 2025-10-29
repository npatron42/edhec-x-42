import { doveProducts } from "../data/products"
import { withTheme } from "../styles/theme"

// Algorithme de recommandation basé sur les réponses du questionnaire ou profil IA
export const getRecommendedProducts = (answers) => {
	// Priorité absolue: si l'IA a fourni une sélection ordonnée (8 cartes), l'utiliser telle quelle
	if (answers && Array.isArray(answers._aiRecs) && answers._aiRecs.length) {
		return answers._aiRecs.filter(Boolean).map((p) => ({ ...p }))
	}

	// Nouveau: si profil IA présent
	if (answers && answers._beautyProfile) {
		const p = answers._beautyProfile
		const aiNeeds = Array.isArray(p.ai?.needs)
			? p.ai.needs.map((s) => String(s).toLowerCase())
			: []
		const aiSkin =
			typeof p.ai?.skin_type === "string"
				? p.ai.skin_type.toLowerCase()
				: null

		// Règles/score simple explicable
		const scored = doveProducts.filter(Boolean).map((prod) => {
			let score = 0
			const reasons = []

			const benefitsText = (
				(prod.description || "") +
				" " +
				(prod.benefits || []).join(" ")
			).toLowerCase()

			// Besoins IA explicites → bonus fort
			if (aiNeeds.length) {
				aiNeeds.forEach((n) => {
					if (benefitsText.includes(n)) {
						score += 30
						reasons.push(`Besoin identifié: ${n}`)
					}
				})
			}

			// Type de peau IA → règles simples
			if (aiSkin) {
				if (
					/sec|très-sec/.test(aiSkin) &&
					/hydrat|nourr/.test(benefitsText)
				) {
					score += 30
					reasons.push("Peau sèche → hydratation")
				}
				if (
					/sensible/.test(aiSkin) &&
					/apais|douceur|protection/.test(benefitsText)
				) {
					score += 20
					reasons.push("Peau sensible → apaisement")
				}
				if (
					/gras|mixte/.test(aiSkin) &&
					/léger|non-gras|éclat/.test(benefitsText)
				) {
					score += 15
					reasons.push("Confort léger recommandé")
				}
			}

			// Règles environnementales (AI/local)
			if (
				(p.env?.uv_index ?? 0) > 6 &&
				/bright|éclat/.test(
					(prod.name + " " + (prod.description || "")).toLowerCase(),
				)
			) {
				score += 25
				reasons.push("UV élevés aujourd’hui")
			}

			// Règles locales (fallback aux features locales si dispo)
			if (
				(p.skin_tone?.mst_bin ?? 4) <= 3 &&
				/hydrat/i.test(benefitsText)
			) {
				score += 15
				reasons.push("Peau potentiellement sèche")
			}
			if (
				(p.hair_features?.frizz_proxy ?? 0) > 0.5 &&
				prod.category === "soin-corps"
			) {
				score += 10
				reasons.push("Frisottis élevés")
			}

			// Bonus diversité
			score +=
				[
					"soin-visage",
					"soin-corps",
					"gel-douche",
					"soin-levres",
					"soin-mains",
				].indexOf(prod.category) * 2
			return {
				...prod,
				matchScore: Math.min(100, score),
				_reasons: reasons,
			}
		})
		return scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
	}

	if (!answers || Object.keys(answers).length === 0) {
		return doveProducts
	}

	const skinType = answers.step1
	const environment = answers.step2
	const preferredCategories = answers.step3 || []
	const needs = answers.step4 || []

	// Calculer un score de correspondance pour chaque produit
	const scoredProducts = doveProducts
		.filter((product) => product && product.id)
		.map((product) => {
			let score = 0

			// Correspondance avec le type de peau (poids: 40%)
			if (product.skinTypes && product.skinTypes.includes(skinType)) {
				score += 40
			}

			// Correspondance avec l'environnement (poids: 20%)
			if (
				product.environment &&
				product.environment.includes(environment)
			) {
				score += 20
			}

			// Correspondance avec les catégories préférées (poids: 20%)
			if (preferredCategories.includes(product.category)) {
				score += 20
			}

			// Correspondance avec les besoins (poids: 20%)
			const matchingNeeds = (product.benefits || []).filter((benefit) =>
				needs.some((need) => benefit.toLowerCase().includes(need)),
			)
			score += (matchingNeeds.length / Math.max(needs.length, 1)) * 20

			return {
				...product,
				matchScore: score,
			}
		})

	// Trier par score décroissant
	const sortedProducts = scoredProducts.sort(
		(a, b) => b.matchScore - a.matchScore,
	)

	return sortedProducts
}

// Générer des données pour le QR code
export const generateQRData = (userAnswers, selectedProducts) => {
	const data = {
		userId: generateUserId(),
		timestamp: new Date().toISOString(),
		profile: userAnswers._beautyProfile
			? {
					ai: true,
					beauty: userAnswers._beautyProfile,
			  }
			: {
					skinType: userAnswers.step1,
					environment: userAnswers.step2,
					preferences: userAnswers.step3,
					needs: userAnswers.step4,
					frequency: userAnswers.step5,
			  },
		products: selectedProducts
			.filter((product) => product && product.id)
			.map((product) => ({
				id: product.id,
				name: product.name || "Produit",
				category: product.category || "Autre",
			})),
	}

	return JSON.stringify(data)
}

// Générer un ID utilisateur unique
const generateUserId = () => {
	return (
		"ECO-" +
		Date.now().toString(36) +
		Math.random().toString(36).substr(2, 9)
	)
}

// Calculer l'impact environnemental d'une sélection de produits
export const calculateImpact = (products, frequency = "monthly") => {
	const safe = Array.isArray(products) ? products.filter(Boolean) : []
	const multipliers = {
		weekly: 4,
		biweekly: 2,
		monthly: 1,
	}

	const multiplier = multipliers[frequency] || 1

	const totalCO2 =
		safe.reduce((sum, product) => sum + (product.co2Saved || 0), 0) *
		multiplier
	const totalPlastic =
		safe.reduce((sum, product) => sum + (product.plasticSaved || 0), 0) *
		multiplier
	const bottlesSaved = Math.floor(totalPlastic / 50) // 1 bouteille ≈ 50g

	return {
		co2SavedPerMonth: totalCO2,
		plasticSavedPerMonth: totalPlastic,
		bottlesSavedPerMonth: bottlesSaved,
		co2SavedPerYear: totalCO2 * 12,
		plasticSavedPerYear: totalPlastic * 12,
		bottlesSavedPerYear: bottlesSaved * 12,
	}
}

// Obtenir un message de match personnalisé
export const getMatchMessage = (matchScore, isDark = false) => {
	const c = withTheme(isDark)
	const palette = [c.primaryDark, c.primary, c.accentDark, c.accent]
	if (matchScore >= 80) {
		return {
			title: "Match Parfait !",
			icon: { provider: "Ionicons", name: "heart" },
			message: "Ce produit est idéal pour vos besoins",
			color: palette[0],
		}
	} else if (matchScore >= 60) {
		return {
			title: "Excellent Match",
			icon: { provider: "Ionicons", name: "heart" },
			message: "Ce produit correspond bien à votre profil",
			color: palette[1],
		}
	} else if (matchScore >= 40) {
		return {
			title: "Bon Match",
			icon: { provider: "Ionicons", name: "heart" },
			message: "Ce produit pourrait vous convenir",
			color: palette[2],
		}
	} else {
		return {
			title: "À Essayer",
			icon: { provider: "Ionicons", name: "heart" },
			message: "Découvrez ce produit",
			color: palette[3],
		}
	}
}

// Formater les statistiques pour l'affichage
export const formatImpactStats = (stats) => {
	return {
		co2: {
			value: stats.co2Saved.toFixed(2),
			unit: "kg",
			label: "CO₂ évité",
			icon: { provider: "Feather", name: "wind" },
			equivalence: `${(stats.co2Saved * 4).toFixed(0)} km en voiture`,
		},
		plastic: {
			value: (stats.plasticSaved / 1000).toFixed(2),
			unit: "kg",
			label: "Plastique économisé",
			icon: { provider: "MaterialCommunityIcons", name: "recycle" },
			equivalence: `${stats.bottlesSaved} bouteilles`,
		},
		money: {
			value: (stats.moneySaved || 0).toFixed(2),
			unit: "€",
			label: "Économies réalisées",
			icon: { provider: "Ionicons", name: "pricetag" },
			equivalence: stats.moneySaved
				? `${Math.max(
						1,
						Math.round((stats.moneySaved || 0) / 4),
				  )} cafés`
				: "",
		},
		refills: {
			value: stats.totalRefills,
			unit: "",
			label: "Recharges effectuées",
			icon: { provider: "MaterialCommunityIcons", name: "refresh" },
			equivalence: "",
		},
	}
}
