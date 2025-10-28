import React from "react"
import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { BlurView } from "expo-blur"
import { SvgXml } from "react-native-svg"
import { spacing, radius, shadow } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"

const getHomeSvg = (color) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
	<path d="M15 18H9" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

const getUserSvg = (color) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="12" cy="6" r="4" stroke="${color}" stroke-width="1.5"/>
	<path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

const getMapSvg = (color) => `
<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M4 2L0 1V14L4 15V2Z" fill="${color}"/>
	<path d="M16 2L12 1V14L16 15V2Z" fill="${color}"/>
	<path d="M10 1L6 2V15L10 14V1Z" fill="${color}"/>
</svg>
`

const getShampooSvg = (color) => `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
	<path d="M274.475,0h-36.951c-19.595,0-35.479,15.884-35.479,35.479v54.9h107.911v-54.9C309.955,15.884,294.071,0,274.475,0z" fill="${color}"/>
	<path d="M356.818,145.093c-13.845-13.663-32.513-21.323-51.965-21.323h-97.707c-19.452,0-38.12,7.661-51.965,21.323c-14.087,13.901-22.016,32.867-22.016,52.657v52.685h245.669V197.75C378.834,177.959,370.905,158.994,356.818,145.093z" fill="${color}"/>
	<rect x="133.165" y="422.957" width="245.671" height="89.043" fill="${color}"/>
	<rect x="133.165" y="283.826" width="245.671" height="105.739" fill="${color}"/>
</svg>
`

function DockButton({ colors, svgGenerator, onPress, isActive }) {
	const iconColor = isActive ? "#dbc88b" : "white"

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.item]}
			accessibilityRole="button"
		>
			{isActive && <View style={styles.activeCircle} />}
			<SvgXml xml={svgGenerator(iconColor)} width={36} height={36} />
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
					svgGenerator={getHomeSvg}
					onPress={() => navigationRef.navigate("Dashboard")}
					isActive={currentRoute === "Dashboard"}
				/>
				<DockButton
					colors={colors}
					svgGenerator={getUserSvg}
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
					svgGenerator={getMapSvg}
					onPress={() => navigationRef.navigate("RefillMap")}
					isActive={currentRoute === "RefillMap"}
				/>
				<DockButton
					colors={colors}
					svgGenerator={getShampooSvg}
					onPress={() => navigationRef.navigate("Products")}
					isActive={currentRoute === "Products"}
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
		bottom: 28,
		alignItems: "center",
		paddingBottom: spacing.md,
		pointerEvents: "box-none",
	},
	dock: {
		width: "80%",
		height: 80,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		borderRadius: 40,
		paddingHorizontal: spacing.lg,
		overflow: "hidden",
	},
	item: {
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	activeCircle: {
		position: "absolute",
		width: 66,
		height: 66,
		borderRadius: 35,
		backgroundColor: "white",
		zIndex: -1,
	},
})
