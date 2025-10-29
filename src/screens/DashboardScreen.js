// ##
// # Copyright (c) 2025 - Indigen Solutions
// # Authors:
// #   - Nicolas Patron <nicolas.patron@indigen.com>
// # NOTICE: All information contained herein is, and remains
// # the property of Indigen Solutions and its suppliers, if any.
// # Dissemination of this information or reproduction of this material
// # is strictly forbidden unless prior written permission is obtained
// # from Indigen Solutions.

import React, { useState, useEffect } from "react"
import { View, StyleSheet, Dimensions, Image } from "react-native"

import {
	getImpactStats,
	getRefillHistory,
	getUserAnswers,
	getSelectedProducts,
	getUserProfile,
} from "../utils/storage.js"
import {
	colors as lightColors,
	spacing,
	radius,
	shadow,
	typography,
} from "../styles/theme.js"

import { useTheme } from "../styles/ThemeProvider.js"

import DahsboardHeader from "../components/dahsboard/DahsboardHeader.js"
import DashboardGrid from "../components/dahsboard/DashboardGrid.js"

export default function DashboardScreen({ navigation }) {
	const { isDark, colors } = useTheme()

	const [stats, setStats] = useState(null)
	const [history, setHistory] = useState([])
	const [userProfile, setUserProfile] = useState(null)
	const [profile, setProfile] = useState(null)
	const [refreshing, setRefreshing] = useState(false)
	const [savingWeather, setSavingWeather] = useState(false)

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

	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 4

	return (
		<View style={[styles.container, { backgroundColor: "#e9ecef" }]}>
			<DahsboardHeader navigation={navigation} />
			<View style={[styles.content, { paddingTop: headerHeight }]}>
				<DashboardGrid />
				<View style={styles.imageContainer}>
					<Image
						source={require("../../assets/refill-image4.png")}
						style={styles.refillStationImage}
						resizeMode="contain"
					/>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	container: { flex: 1 },
	content: { flex: 1 },
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
	weatherButtonContainer: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.lg,
	},
	weatherButton: {
		backgroundColor: "#007bff",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.xl,
		borderRadius: radius.lg,
		alignItems: "center",
		justifyContent: "center",
		...shadow.card,
	},
	weatherButtonDisabled: {
		backgroundColor: "#6c757d",
		opacity: 0.6,
	},
	weatherButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	imageContainer: {
		position: "fixed",
		top: 10,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1000,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.xl,
	},
	refillStationImage: {
		width: "100%",
		height: 250,
		borderRadius: 60,
	},
})
