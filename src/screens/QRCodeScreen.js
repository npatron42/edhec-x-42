import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	StyleSheet,
	Share,
	Platform,
	TouchableOpacity,
} from "react-native"

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
				headerSubtitle="Utilisez votre QR Code sur l'une de nos bornes pour remplir vos produits Vaseline."
				navigation={navigation}
			/>
			<View style={styles.centeredContainer}>
				<View
					style={[
						styles.qrCard,
						{ backgroundColor: themeColors.surface },
					]}
				>
					<View style={styles.qrWrapper}>
						{qrData ? (
							<View style={styles.qrCodeContainer}>
								<QRCode
									value={qrData}
									size={280}
									backgroundColor="white"
									color={themeColors.text}
									logoSize={40}
									logoBackgroundColor="white"
									logoMargin={4}
								/>
							</View>
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
					<View style={styles.qrInfoContainer}>
						<Text
							style={[
								styles.qrInfo,
								{ color: themeColors.textMuted },
							]}
						>
							Nos produits n'attendent que vous.
						</Text>
					</View>

					{qrData && (
						<TouchableOpacity
							style={[
								styles.shareButton,
								{ backgroundColor: themeColors.primary },
							]}
							onPress={() => {
								Share.share({
									message: `Voici mon QR Code personnalisé pour les bornes Vaseline ! 
								
Données: ${qrData}`,
									title: "Mon QR Code Vaseline",
								})
							}}
						>
							<AppIcon
								name="share"
								provider="Feather"
								size={20}
								color="white"
							/>
							<Text
								style={[
									styles.shareButtonText,
									{ color: "white" },
								]}
							>
								Partager
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
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
		padding: spacing.xl,
		alignItems: "center",
		width: "100%",
		maxWidth: 400,
		...shadow.soft,
	},
	qrWrapper: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.lg,
	},
	qrCodeContainer: {
		backgroundColor: "white",
		borderRadius: radius.md,
		padding: spacing.lg,
		marginBottom: spacing.md,
		...shadow.soft,
	},
	qrPlaceholder: {
		alignItems: "center",
		justifyContent: "center",
	},
	qrPlaceholderText: {
		marginTop: spacing.sm,
		color: colors.textMuted,
	},
	qrInfoContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: spacing.lg,
		paddingHorizontal: spacing.xl,
		width: "100%",
	},
	qrInfo: {
		...typography.body,
		textAlign: "center",
		lineHeight: 20,
		fontWeight: "300",
		width: "100%",
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
	shareButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.xl,
		borderRadius: radius.md,
		marginTop: spacing.xl,
		width: "100%",
		gap: spacing.sm,
	},
	shareButtonText: {
		...typography.body,
		fontWeight: "600",
		textAlign: "center",
	},
})
