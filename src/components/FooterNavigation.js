import React from "react"
import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { BlurView } from "expo-blur"
import { AppIcon } from "./common"
import { spacing, radius, shadow } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"

function DockButton({ colors, icon, label, onPress, isActive }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.item,
			]}
			accessibilityRole="button"
			accessibilityLabel={label}
		>
			<AppIcon
				name={icon.name}
				provider={icon.provider}
				size={24}
				color={isActive ? "#dbc88b" : "white"}
			/>
			<Text
				style={{
					fontSize: 12,
					color: "white",
					marginTop: 6,
					fontWeight: 600,
				}}
			>
				{label}
			</Text>
		</TouchableOpacity>
	)
}

export default function FooterNavigation({ navigationRef, currentRoute }) {
	const { isDark, colors } = useTheme()

	return (
		<View pointerEvents="box-none" style={styles.wrap}>
			<BlurView
				intensity={isDark ? 28 : 20}
				tint={isDark ? "dark" : "light"}
				style={[
					styles.dock,
					{
						backgroundColor: colors.primary,
					},
				]}
			>
				<DockButton
					colors={colors}
					icon={{ provider: "Ionicons", name: "home" }}
					label="Accueil"
					onPress={() => navigationRef.navigate("Dashboard")}
					isActive={currentRoute === "Dashboard"}
				/>
				<DockButton
					colors={colors}
					icon={{
						provider: "MaterialCommunityIcons",
						name: "map-marker-radius",
					}}
					label="Bornes"
					onPress={() => navigationRef.navigate("RefillMap")}
					isActive={currentRoute === "RefillMap"}
				/>
				<DockButton
					colors={colors}
					icon={{ provider: "Ionicons", name: "qr-code" }}
					label="Mon QR"
					onPress={() =>
						navigationRef.navigate("QRCode", {
							answers: {},
							selectedProducts: [],
						})
					}
					isActive={currentRoute === "QRCode"}
				/>
				<DockButton
					colors={colors}
					icon={{
						provider: "Ionicons",
						name: "cube-outline",
					}}
					label="Produits"
					onPress={() => navigationRef.navigate("Products")}
					isActive={currentRoute === "Products"}
				/>
				<DockButton
					colors={colors}
					icon={{
						provider: "MaterialCommunityIcons",
						name: "history",
					}}
					label="Historique"
					onPress={() => navigationRef.navigate("History")}
					isActive={currentRoute === "History"}
				/>
			</BlurView>
		</View>
	)
}

const styles = StyleSheet.create({
	wrap: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -12,
		alignItems: "center",
		paddingBottom: spacing.md,
		pointerEvents: "box-none",
	},
	dock: {
		position: "fixed",
		width: "100%",
		height: 80,
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.lg,
	},
	item: { alignItems: "center", justifyContent: "center" },
})
