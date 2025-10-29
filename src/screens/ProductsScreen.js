import React from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Platform,
	Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { vaselineProducts } from "../data/products"
import { colors, spacing, radius, shadow, typography } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"
import Header from "./Header"

const getProductName = (product) => {
	const nameMap = {
		"products.items.menFastAbsorbingLotion.name":
			"Men Fast Absorbing Lotion",
		"products.items.healingJellyCocoaButter.name":
			"Healing Jelly Cocoa Butter",
		"products.items.lipTherapyOriginalTin.name": "Lip Therapy Original Tin",
		"products.items.lipTherapyAloeTin.name": "Lip Therapy Aloe Tin",
		"products.items.lipTherapyRosyLipsTin.name":
			"Lip Therapy Rosy Lips Tin",
		"products.items.lipTherapyPinkBubblyTin.name":
			"Lip Therapy Pink Bubbly Tin",
		"products.items.lipTherapyCocoaButterTin.name":
			"Lip Therapy Cocoa Butter Tin",
		"products.items.healingJellyOriginal.name": "Healing Jelly Original",
		"products.items.healingJellyBaby.name": "Healing Jelly Baby",
		"products.items.intensiveCareDrySkinRepairLotion.name":
			"Intensive Care Dry Skin Repair Lotion",
		"products.items.intensiveCareAloeVeraHydrationLotion.name":
			"Intensive Care Aloe Vera Hydration Lotion",
		"products.items.intensiveCareCalmHealingLotion.name":
			"Intensive Care Calm Healing Lotion",
		"products.items.intensiveCareHydraStrengthHandCreme.name":
			"Intensive Care Hydra Strength Hand Crème",
		"products.items.intensiveCareHydraReplenishHandCreme.name":
			"Intensive Care Hydra Replenish Hand Crème",
		"products.items.proVitab3SuppleAndSoftSerumBurstLotion.name":
			"Pro VitaB3 Supple & Soft Serum-Burst Lotion",
		"products.items.proVitab3LuminousGlowSerumBurstLotion.name":
			"Pro VitaB3 Luminous Glow Serum-Burst Lotion",
		"products.items.intensiveCareHealthyHandsStrongerNailsLotion.name":
			"Intensive Care Healthy Hands Stronger Nails Lotion",
		"products.items.allOverBodyBalmJellyStick.name":
			"All-Over Body Balm Jelly Stick",
	}
	return nameMap[product.i18n.name] || `Produit ${product.id}`
}

const getProductDescription = (product) => {
	const descMap = {
		"products.items.menFastAbsorbingLotion.description":
			"Lotion à absorption rapide spécialement conçue pour les hommes",
		"products.items.healingJellyCocoaButter.description":
			"Baume réparateur enrichi au beurre de cacao pour une hydratation intense",
		"products.items.lipTherapyOriginalTin.description":
			"Baume à lèvres original pour apaiser et réparer les lèvres sèches",
		"products.items.lipTherapyAloeTin.description":
			"Baume à lèvres à l'aloe vera pour un effet apaisant",
		"products.items.lipTherapyRosyLipsTin.description":
			"Baume à lèvres teinté pour des lèvres rosées et hydratées",
		"products.items.lipTherapyPinkBubblyTin.description":
			"Baume à lèvres pétillant rose pour un effet frais et rafraîchissant",
		"products.items.lipTherapyCocoaButterTin.description":
			"Baume à lèvres au beurre de cacao pour une nutrition profonde",
		"products.items.healingJellyOriginal.description":
			"Baume réparateur original pour apaiser et protéger la peau",
		"products.items.healingJellyBaby.description":
			"Baume réparateur doux spécialement formulé pour les bébés",
		"products.items.intensiveCareDrySkinRepairLotion.description":
			"Lotion intensive pour réparer et hydrater les peaux très sèches",
		"products.items.intensiveCareAloeVeraHydrationLotion.description":
			"Lotion hydratante à l'aloe vera pour une sensation fraîche",
		"products.items.intensiveCareCalmHealingLotion.description":
			"Lotion apaisante pour calmer et réparer les peaux sensibles",
		"products.items.intensiveCareHydraStrengthHandCreme.description":
			"Crème mains intensive pour renforcer et hydrater",
		"products.items.intensiveCareHydraReplenishHandCreme.description":
			"Crème mains pour restaurer et nourrir la peau",
		"products.items.proVitab3SuppleAndSoftSerumBurstLotion.description":
			"Lotion avec sérum enrichi en vitamine B3 pour une peau souple et douce",
		"products.items.proVitab3LuminousGlowSerumBurstLotion.description":
			"Lotion avec sérum pour un éclat lumineux et une peau uniforme",
		"products.items.intensiveCareHealthyHandsStrongerNailsLotion.description":
			"Lotion mains pour renforcer les ongles et hydrater la peau",
		"products.items.allOverBodyBalmJellyStick.description":
			"Bâton baume multi-usages pour une hydratation nomade",
	}
	return descMap[product.i18n.description] || "Description non disponible"
}

export default function ProductsScreen({ navigation }) {
	const { colors: themeColors } = useTheme()
	return (
		<SafeAreaView
			style={[
				styles.safeArea,
				{ backgroundColor: themeColors.background },
			]}
		>
			<Header
				headerTitle="Catalogue produits"
				headerSubtitle="Découvrez les produits Vaseline adaptés à votre profil"
				navigation={navigation}
			/>
			<ScrollView style={styles.content}>
				{vaselineProducts.map((p) => (
					<View
						key={p.id}
						style={[
							styles.card,
							{
								backgroundColor: themeColors.surface,
								borderColor: themeColors.border,
							},
						]}
					>
						<Image source={p.image} style={styles.productImage} />
						<View style={styles.productInfo}>
							<Text
								style={[
									styles.name,
									{ color: themeColors.textPrimary },
								]}
							>
								{getProductName(p)}
							</Text>
							<Text
								style={[
									styles.desc,
									{ color: themeColors.textSecondary },
								]}
							>
								{getProductDescription(p)}
							</Text>
						</View>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: colors.background },
	container: {
		flex: 1,
		backgroundColor: colors.surface,
		...(Platform.OS === "web" && { height: "100vh", overflow: "auto" }),
	},
	content: {
		flexGrow: 1,
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xxxl,
		...(Platform.OS === "web" && { minHeight: "100vh" }),
	},
	heroBanner: {
		marginTop: spacing.md,
		marginBottom: spacing.lg,
		padding: spacing.xxl,
		borderRadius: radius.xxl,
		...shadow.strong,
	},
	heroHeaderRow: { flexDirection: "row", alignItems: "center" },
	heroTitle: { ...typography.h2, marginBottom: spacing.xs },
	heroSubtitle: { ...typography.body },
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.lg,
		padding: spacing.lg,
		marginBottom: spacing.sm,
		...shadow.soft,
	},
	productImage: {
		width: 80,
		height: 80,
		marginRight: spacing.lg,
		resizeMode: "contain",
		borderRadius: radius.md,
	},
	productInfo: {
		flex: 1,
	},
	name: { ...typography.h4, color: colors.textPrimary },
	desc: {
		...typography.body,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
})
