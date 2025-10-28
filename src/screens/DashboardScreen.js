import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import {
	getImpactStats,
	getRefillHistory,
	getUserAnswers,
	getSelectedProducts,
	getUserProfile,
} from "../utils/storage"
import { formatImpactStats } from "../utils/recommendations"
import {
	colors as lightColors,
	spacing,
	radius,
	shadow,
	typography,
} from "../styles/theme"
import { AppButton, AppIcon } from "../components/common"
import { useTheme } from "../styles/ThemeProvider"

export default function DashboardScreen({ navigation }) {
	const { isDark, colors } = useTheme()

	const [stats, setStats] = useState(null)
	const [history, setHistory] = useState([])
	const [userProfile, setUserProfile] = useState(null)
	const [profile, setProfile] = useState(null)
	const [refreshing, setRefreshing] = useState(false)

	const loadData = async () => {
		const [impactStats, refillHistory, answers, products, profileData] =
			await Promise.all([
				getImpactStats(),
				getRefillHistory(),
				getUserAnswers(),
				getSelectedProducts(),
				getUserProfile(),
			])
		setStats(impactStats)
		setHistory(refillHistory)
		setUserProfile({ answers, products })
		setProfile(profileData)
	}

	useEffect(() => {
		let isMounted = true
		;(async () => {
			if (isMounted) {
				await loadData()
			}
		})()
		return () => {
			isMounted = false
		}
	}, [])

	const onRefresh = async () => {
		setRefreshing(true)
		await loadData()
		setRefreshing(false)
	}

	const formattedStats = stats ? formatImpactStats(stats) : null
	const availableDiscounts = (profile?.rewards?.discounts || []).filter(
		(discount) => !discount.used,
	)

	// Revenir à 4 cartes d'économies: argent, plastique, CO2, recharges
	const savingsKeys = ["money", "plastic", "co2", "refills"]

	const openPreviousSummary = () => {
		const answers = userProfile?.answers || null
		const bp = answers?._beautyProfile || null
		if (!answers || !bp) {
			navigation.navigate("CameraCapture")
			return
		}
		const hair = bp.ai?.hair || null
		const analysis = {
			skinType: bp.ai?.skin_type || "—",
			needs: Array.isArray(bp.ai?.needs) ? bp.ai.needs : [],
			notes: Array.isArray(bp.ai?.notes)
				? bp.ai.notes
				: bp.rationale
				? [bp.rationale]
				: [],
			hair: hair
				? {
						type: hair.type || "--",
						density: hair.density || undefined,
						frizz:
							typeof hair.frizz === "number"
								? hair.frizz
								: undefined,
						shine:
							typeof hair.shine === "number"
								? hair.shine
								: undefined,
				  }
				: undefined,
		}
		navigation.navigate("SkinSummary", {
			analysis,
			answers,
			photoBase64: null,
		})
	}

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
		>
			<ScrollView
				style={[styles.container]}
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: spacing.xxxl * 2 },
				]}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						colors={[colors.primary]}
						tintColor={colors.primary}
					/>
				}
			>
				<View style={styles.helloContainer}>
					<Text style={styles.helloH1}>Bonjour,</Text>
					<Text style={styles.helloName}>
						{profile?.name || "Beauty Pioneer"}
					</Text>
					<AppIcon
						name="person-circle-outline"
						onPress={() => navigation.navigate("Profile")}
						provider="Ionicons"
						size={36}
						color={colors.primary}
						style={{ marginLeft: 120 }}
					/>
				</View>
				<LinearGradient
					colors={[colors.primary, colors.accent]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[
						styles.heroBanner,
						{ borderColor: "#d9c484", borderWidth: 5 },
					]}
				>
					<View
						style={{
							alignItems: "center",
							justifyContent: "center",
							gap: spacing.md,
						}}
					>
						<AppButton
							label="Analyse de la peau"
							icon={{ name: "scan", provider: "Ionicons" }}
							onPress={() => navigation.navigate("CameraCapture")}
							style={{ minWidth: 240, alignSelf: "center" }}
						/>
						<AppButton
							variant="subtle"
							label="Vos recommendations"
							icon={{
								name: "document-text",
								provider: "Ionicons",
								color: colors.primary,
							}}
							onPress={openPreviousSummary}
							style={{
								backgroundColor: "white",
								marginTop: spacing.sm,
								alignSelf: "center",
							}}
						/>
					</View>
				</LinearGradient>

				{formattedStats ? (
					<View
						style={[
							styles.section,
							{ paddingHorizontal: spacing.xl },
						]}
					>
						<View style={styles.statsGrid}>
							{savingsKeys.map((k, index) => {
								const stat = formattedStats[k]
								if (!stat) return null
								const grad =
									index === 0
										? [colors.primary, "#0F68A3"]
										: index === 1
										? ["#ffffff", "#165185"]
										: index === 2
										? ["#ffffff", "#165185"]
										: [colors.backgroundAlt, colors.surface]
								return (
									<View
										key={`saving-${k}`}
										style={styles.statCard}
									>
										<LinearGradient
											colors={grad}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
											style={styles.statGradient}
										>
											<View
												style={[
													styles.statIconWrapper,
													{
														backgroundColor:
															colors.background,
													},
												]}
											>
												<AppIcon
													name={stat.icon?.name}
													provider={
														stat.icon?.provider
													}
													size={22}
													color={
														index === 1
															? colors.accent
															: colors.primary
													}
												/>
											</View>
											<Text
												style={[
													styles.statValue,
													{
														color: colors.textPrimary,
													},
												]}
											>
												{stat.value} {stat.unit}
											</Text>
											<Text
												style={[
													styles.statLabel,
													{
														color: colors.textSecondary,
													},
												]}
											>
												{stat.label}
											</Text>
											{stat.equivalence ? (
												<Text
													style={[
														styles.statEquivalence,
														{
															color: colors.textMuted,
														},
													]}
												>
													{stat.equivalence}
												</Text>
											) : null}
										</LinearGradient>
									</View>
								)
							})}
						</View>
					</View>
				) : null}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	container: { flex: 1 },
	content: { flexGrow: 1 },
	helloContainer: {
		marginHorizontal: spacing.xl,
		padding: spacing.xl,
		flexDirection: "row",
		alignItems: "center",
	},
	helloH1: {
		fontSize: 28,
		fontWeight: "600",
		color: "black",
		marginRight: spacing.xs,
	},
	helloName: { fontSize: 24, fontWeight: "400", color: "black" },
	heroBanner: {
		marginHorizontal: spacing.xl,
		marginBottom: spacing.lg,
		padding: spacing.xxxl,
		borderRadius: radius.xxxl,
		overflow: "hidden",
	},
	bannerTextContainer: { flex: 1, marginRight: spacing.md },
	bannerGreeting: { ...typography.label, marginBottom: spacing.xs },
	bannerName: { ...typography.h1 },
	profileAvatarButton: {
		width: 48,
		height: 48,
		borderRadius: radius.full,
		alignItems: "center",
		justifyContent: "center",
		...shadow.soft,
	},
	bannerSubtitle: { ...typography.body },

	section: { marginBottom: spacing.xl },
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.md,
	},
	sectionTitle: { ...typography.h3 },

	statsGrid: {
		marginTop: spacing.xxl,
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xl,
		justifyContent: "center",
	},
	statCard: {
		width: "40%",
		height: "40%",
		borderRadius: radius.xl,
		overflow: "hidden",
		...shadow.card,
	},
	statGradient: {
		padding: spacing.xl,
		minHeight: 180,
	},
	statIconWrapper: {
		width: 48,
		height: 48,
		borderRadius: radius.lg,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.md,
		...shadow.soft,
	},
	statValue: { ...typography.h3 },
	statLabel: { ...typography.label },
	statEquivalence: { ...typography.caption },

	// Progress
	progressCard: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.lg,
		marginBottom: spacing.md,
		marginTop: spacing.sm,
		...shadow.soft,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: spacing.sm,
	},
	progressLabel: { ...typography.label },
	progressValue: { ...typography.label },
	progressBar: {
		height: 10,
		borderRadius: radius.full,
		overflow: "hidden",
		marginBottom: spacing.sm,
	},
	progressFill: { height: "100%", borderRadius: radius.full },
	progressCaption: { ...typography.caption },

	// Badges
	badgesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
		paddingHorizontal: spacing.xl,
	},
	badge: {
		width: "22%",
		paddingVertical: spacing.md,
		alignItems: "center",
		borderRadius: radius.lg,
		...shadow.soft,
	},
	badgeEmoji: { fontSize: 20, marginBottom: spacing.xs, color: "white" },
	badgeLabel: { ...typography.caption, textAlign: "center", color: "white" },

	// Encouragement
	encouragement: {
		marginHorizontal: spacing.xl,
		marginBottom: spacing.lg,
		padding: spacing.lg,
		borderRadius: radius.xl,
		borderWidth: 1,
		...shadow.soft,
	},
	encouragementTitle: { ...typography.h4, marginBottom: spacing.xs },
	encouragementText: { ...typography.body },
})
