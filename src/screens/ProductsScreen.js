import React from "react"
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Platform,
	Image,
	Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { vaselineProducts } from "../data/products"
import { colors, spacing, radius, shadow, typography } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"
import Header from "./Header"

export default function ProductsScreen({ navigation }) {
	const { colors: themeColors } = useTheme()
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 5
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
			<ScrollView
				style={styles.content}
				contentContainerStyle={[
					styles.contentContainer,
					{ paddingTop: headerHeight + spacing.md },
				]}
			>
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<View style={styles.sectionTitleContainer}>
							<Text
								style={[
									styles.sectionTitle,
									{ color: themeColors.textPrimary },
								]}
							>
								Soins du corps
							</Text>
							<View
								style={[
									styles.sectionUnderline,
									{ backgroundColor: themeColors.primary },
								]}
							/>
						</View>
					</View>
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
					<View style={styles.sectionHeader}>
						<View style={styles.sectionTitleContainer}>
							<Text
								style={[
									styles.sectionTitle,
									{ color: themeColors.textPrimary },
								]}
							>
								Soins des mains
							</Text>
							<View
								style={[
									styles.sectionUnderline,
									{ backgroundColor: themeColors.primary },
								]}
							/>
						</View>
					</View>
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
					<View style={styles.sectionHeader}>
						<View style={styles.sectionTitleContainer}>
							<Text
								style={[
									styles.sectionTitle,
									{ color: themeColors.textPrimary },
								]}
							>
								Soins lèvres
							</Text>
							<View
								style={[
									styles.sectionUnderline,
									{ backgroundColor: themeColors.primary },
								]}
							/>
						</View>
					</View>
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
	},
	contentContainer: {
		paddingBottom: 100,
	},
	section: {
		marginTop: spacing.md,
		marginBottom: spacing.lg,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.md,
	},
	sectionTitleContainer: {
		flex: 1,
	},
	sectionTitle: {
		...typography.h4,
		fontWeight: "bold",
	},
	sectionUnderline: {
		width: "75%",
		height: 2,
		marginTop: spacing.xs,
	},
	sectionIcon: {
		marginLeft: 8,
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
		width: 160,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.lg,
		padding: spacing.sm,
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
		width: 120,
		height: 120,
		alignSelf: "center",
		marginBottom: spacing.xs,
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
	hName: {
		...typography.h6,
		marginTop: spacing.xs,
		fontSize: 13,
		lineHeight: 16,
	},
	hDesc: {
		...typography.caption,
		marginTop: spacing.xs,
		fontSize: 11,
		lineHeight: 14,
	},
})
