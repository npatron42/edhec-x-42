import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Share, Platform } from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import QRCode from "react-native-qrcode-svg"
import { AppIcon } from "../components/common"
import { generateQRData, calculateImpact } from "../utils/recommendations"
import { addRefillToHistory } from "../utils/storage"
import { colors, spacing, radius, shadow, typography } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"
import Header from "./Header"

export default function QRCodeScreen({ route, navigation }) {
	const { colors: themeColors } = useTheme()
	const { answers = {}, selectedProducts = [] } = route.params || {}
	const safeSelected = Array.isArray(selectedProducts)
		? selectedProducts.filter(Boolean)
		: []
	const [qrData, setQrData] = useState("")
	const [impact, setImpact] = useState(null)

	useEffect(() => {
		const data = generateQRData(answers, safeSelected)
		setQrData(data)
		const freq = answers.step5 || "monthly"
		setImpact(calculateImpact(safeSelected, freq))
	}, [JSON.stringify(answers), JSON.stringify(safeSelected)])

	return (
		<SafeAreaView
			style={[
				styles.safeArea,
				{ backgroundColor: themeColors.background },
			]}
		>
			<Header
				headerTitle="QR Code"
				headerSubtitle="Générez un QR Code pour vos préférences et les produits sélectionnés"
				navigation={navigation}
			/>
			<View
				style={[
					styles.qrCard,
				]}
			>
				<View style={styles.qrWrapper}>
					{qrData ? (
						<QRCode value={qrData} size={300} />
					) : (
						<View style={styles.qrPlaceholder}>
							<AppIcon
								name="loader"
								provider="Feather"
								size={32}
								color={themeColors.primary}
							/>
							<Text
								style={[
									styles.qrPlaceholderText,
									{ color: themeColors.textMuted },
								]}
							>
								Génération du QR Code…
							</Text>
						</View>
					)}
				</View>
				<Text style={[styles.qrInfo, { color: themeColors.textMuted }]}>
					Ce QR Code encode simplement vos choix et produits. 
				</Text>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: colors.surface,
		...(Platform.OS === "web" && {
			height: "100vh",
			overflow: "auto",
		}),
	},
	content: {
		flexGrow: 1,
		paddingHorizontal: spacing.xl,
		...(Platform.OS === "web" && {
			minHeight: "100vh",
		}),
	},
	qrCard: {
		borderRadius: radius.lg,
		padding: spacing.lg,
        alignSelf: "center",
		marginBottom: spacing.xxl,
		alignItems: "center",
		...shadow.soft,
	},
	qrWrapper: {
        display: "flex",
		alignItems: "center",
		justifyContent: "center",
		minHeight: 500,
	},
	qrPlaceholder: {
		alignItems: "center",
		justifyContent: "center",
	},
	qrPlaceholderText: {
		marginTop: spacing.sm,
		color: colors.textMuted,
	},
	qrInfo: {
		fontSize: 12,
		bottom: 80,
	},
	section: { marginBottom: spacing.xl },
	sectionTitle: {
		...typography.h4,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	sectionText: { ...typography.body, color: colors.textSecondary },
	productRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.xs,
	},
	productEmoji: { fontSize: 20, marginRight: spacing.md },
	productName: { ...typography.body },
	impactRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: spacing.xs,
		gap: spacing.sm,
	},
	cta: { marginTop: spacing.lg, marginBottom: spacing.lg },
})
