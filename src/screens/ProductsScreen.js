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
							{p.name}
						</Text>
						<Text
							style={[
								styles.desc,
								{ color: themeColors.textSecondary },
							]}
						>
							{p.description}
						</Text>
					</View>
				</View>
			))}
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
