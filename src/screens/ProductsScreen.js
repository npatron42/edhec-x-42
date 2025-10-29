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

export default function ProductsScreen({ navigation }) {
	const { colors: themeColors } = useTheme()
	const bodyProducts = vaselineProducts.filter(
		(p) => p.category === "soin-corps",
	)
	const handProducts = vaselineProducts.filter(
		(p) => p.category === "soin-mains",
	)
	const lipProducts = vaselineProducts.filter(
		(p) => p.category === "soin-levres",
	)

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
				<View style={styles.section}>
					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.textPrimary },
						]}
					>
						Soins corps
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalList}
					>
						{bodyProducts.map((p) => (
							<View
								key={`body-${p.id}`}
								style={[
									styles.hCard,
									{
										backgroundColor: themeColors.surface,
										borderColor: themeColors.border,
									},
								]}
							>
								<Image source={p.image} style={styles.hImage} />
								<Text
									style={[
										styles.hName,
										{ color: themeColors.textPrimary },
									]}
									numberOfLines={2}
								>
									{p.name}
								</Text>
								<Text
									style={[
										styles.hDesc,
										{ color: themeColors.textSecondary },
									]}
									numberOfLines={2}
								>
									{p.description}
								</Text>
							</View>
						))}
					</ScrollView>
				</View>

				<View style={styles.section}>
					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.textPrimary },
						]}
					>
						Soins mains
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalList}
					>
						{handProducts.map((p) => (
							<View
								key={`hands-${p.id}`}
								style={[
									styles.hCard,
									{
										backgroundColor: themeColors.surface,
										borderColor: themeColors.border,
									},
								]}
							>
								<Image source={p.image} style={styles.hImage} />
								<Text
									style={[
										styles.hName,
										{ color: themeColors.textPrimary },
									]}
									numberOfLines={2}
								>
									{p.name}
								</Text>
								<Text
									style={[
										styles.hDesc,
										{ color: themeColors.textSecondary },
									]}
									numberOfLines={2}
								>
									{p.description}
								</Text>
							</View>
						))}
					</ScrollView>
				</View>

				<View style={styles.section}>
					<Text
						style={[
							styles.sectionTitle,
							{ color: themeColors.textPrimary },
						]}
					>
						Soins lèvres
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.horizontalList}
					>
						{lipProducts.map((p) => (
							<View
								key={`lips-${p.id}`}
								style={[
									styles.hCard,
									{
										backgroundColor: themeColors.surface,
										borderColor: themeColors.border,
									},
								]}
							>
								<Image source={p.image} style={styles.hImage} />
								<Text
									style={[
										styles.hName,
										{ color: themeColors.textPrimary },
									]}
									numberOfLines={2}
								>
									{p.name}
								</Text>
								<Text
									style={[
										styles.hDesc,
										{ color: themeColors.textSecondary },
									]}
									numberOfLines={2}
								>
									{p.description}
								</Text>
							</View>
						))}
					</ScrollView>
				</View>
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
	section: {
		marginTop: spacing.lg,
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		...typography.h3,
		marginBottom: spacing.md,
	},
	horizontalList: {
		paddingRight: spacing.xl,
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
	hCard: {
		width: 220,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.lg,
		padding: spacing.md,
		marginRight: spacing.md,
		...shadow.soft,
	},
	productImage: {
		width: 80,
		height: 80,
		marginRight: spacing.lg,
		resizeMode: "contain",
		borderRadius: radius.md,
	},
	hImage: {
		width: 160,
		height: 160,
		alignSelf: "center",
		marginBottom: spacing.sm,
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
	hName: { ...typography.h5, marginTop: spacing.xs },
	hDesc: { ...typography.caption, marginTop: spacing.xs },
})
