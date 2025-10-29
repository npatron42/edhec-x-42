import React from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Platform,
	TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { doveProducts } from "../data/products"
import { colors, spacing, radius, shadow, typography } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"
import Header from "./Header"

const getProductName = (product) => {
	const names = {
		1: "Hydratation Intense",
		2: "Gel Douche Hydratant",
		3: "Lotion Corporelle Réparatrice",
		4: "Crème Visage Nourrissante",
		5: "Shampooing Doux",
		6: "Masque Hydratant",
		7: "Sérum Anti-Âge",
		8: "Crème Mains Réparatrice",
	}
	return names[product.id] || `Produit ${product.id}`
}

const getProductDescription = (product) => {
	const descriptions = {
		1: "Hydratation profonde pour peaux sèches et sensibles",
		2: "Gel douche nourrissant qui respecte la barrière cutanée",
		3: "Lotion corporelle qui répare et hydrate en profondeur",
		4: "Crème visage riche en actifs hydratants",
		5: "Shampooing doux pour tous types de cheveux",
		6: "Masque hydratant pour un soin intensif",
		7: "Sérum concentré pour lutter contre les signes de l'âge",
		8: "Crème mains réparatrice et protectrice",
	}
	return descriptions[product.id] || "Description non disponible"
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
				headerSubtitle="Découvrez les formules Dove adaptées à votre profil"
				navigation={navigation}
			/>
			<ScrollView style={styles.content}>
				{doveProducts.map((p) => (
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
						<Text style={styles.emoji}>{p.image || "📦"}</Text>
						<View style={{ flex: 1 }}>
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
	emoji: { fontSize: 40, marginRight: spacing.lg },
	name: { ...typography.h4, color: colors.textPrimary },
	desc: {
		...typography.body,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
})
