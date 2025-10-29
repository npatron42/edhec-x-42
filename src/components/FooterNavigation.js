import React from "react"
import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { BlurView } from "expo-blur"
import { SvgXml } from "react-native-svg"
import { spacing, radius, shadow } from "../styles/theme"
import { useTheme } from "../styles/ThemeProvider"

const getHomeSvgInactive = (color) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
	<path d="M15 18H9" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

const getHomeSvgActive = (color) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
	<path d="M15 18H9" stroke="#606A88" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

const getMapSvgActive = (color) => `
<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M4 2L0 1V14L4 15V2Z" fill="#606A88"/>
	<path d="M16 2L12 1V14L16 15V2Z" fill="#606A88"/>
	<path d="M10 1L6 2V15L10 14V1Z" fill="${color}"/>
</svg>
`

const getMapSvgInactive = (color) => `
<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M4 2L0 1V14L4 15V2Z" fill="${color}"/>
	<path d="M16 2L12 1V14L16 15V2Z" fill="${color}"/>
	<path d="M10 1L6 2V15L10 14V1Z" fill="${color}"/>
</svg>
`

const getQRCodeSvgActive = (color) => `
<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg fill="#606A88" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M8,21H4a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H8a1,1,0,0,0,0-2Zm14-6a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H16a1,1,0,0,0,0,2h4a3,3,0,0,0,3-3V16A1,1,0,0,0,22,15ZM20,1H16a1,1,0,0,0,0,2h4a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V4A3,3,0,0,0,20,1ZM2,9A1,1,0,0,0,3,8V4A1,1,0,0,1,4,3H8A1,1,0,0,0,8,1H4A3,3,0,0,0,1,4V8A1,1,0,0,0,2,9Zm8-4H6A1,1,0,0,0,5,6v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V6A1,1,0,0,0,10,5ZM9,9H7V7H9Zm5,2h4a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1v4A1,1,0,0,0,14,11Zm1-4h2V9H15Zm-5,6H6a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,17H7V15H9Zm5-1a1,1,0,0,0,1-1,1,1,0,0,0,0-2H14a1,1,0,0,0-1,1v1A1,1,0,0,0,14,16Zm4-3a1,1,0,0,0-1,1v3a1,1,0,0,0,0,2h1a1,1,0,0,0,1-1V14A1,1,0,0,0,18,13Zm-4,4a1,1,0,1,0,1,1A1,1,0,0,0,14,17Z"/></svg>
`

const getQRCodeSvgInactive = (color) => `
<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg fill="#ffffff" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M8,21H4a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H8a1,1,0,0,0,0-2Zm14-6a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H16a1,1,0,0,0,0,2h4a3,3,0,0,0,3-3V16A1,1,0,0,0,22,15ZM20,1H16a1,1,0,0,0,0,2h4a1,1,0,0,1,1,1V8a1,1,0,0,0,2,0V4A3,3,0,0,0,20,1ZM2,9A1,1,0,0,0,3,8V4A1,1,0,0,1,4,3H8A1,1,0,0,0,8,1H4A3,3,0,0,0,1,4V8A1,1,0,0,0,2,9Zm8-4H6A1,1,0,0,0,5,6v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V6A1,1,0,0,0,10,5ZM9,9H7V7H9Zm5,2h4a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1v4A1,1,0,0,0,14,11Zm1-4h2V9H15Zm-5,6H6a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,17H7V15H9Zm5-1a1,1,0,0,0,1-1,1,1,0,0,0,0-2H14a1,1,0,0,0-1,1v1A1,1,0,0,0,14,16Zm4-3a1,1,0,0,0-1,1v3a1,1,0,0,0,0,2h1a1,1,0,0,0,1-1V14A1,1,0,0,0,18,13Zm-4,4a1,1,0,1,0,1,1A1,1,0,0,0,14,17Z"/></svg>
`

const getUserSvgActive = (color) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="12" cy="6" r="4" stroke="${color}" stroke-width="1.5"/>
	<path d="M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`

function DockButton({ colors, svgActive, svgInactive, onPress, isActive }) {
	const iconColor = isActive ? "#dbc88b" : "white"
	const svgToUse = isActive ? svgActive : svgInactive

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.item]}
			accessibilityRole="button"
		>
			{isActive && <View style={styles.activeCircle} />}
			<SvgXml xml={svgToUse(iconColor)} width={36} height={36} />
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
					svgActive={getHomeSvgActive}
					svgInactive={getHomeSvgInactive}
					onPress={() => navigationRef.navigate("Dashboard")}
					isActive={currentRoute === "Dashboard"}
				/>
				<DockButton
					colors={colors}
					svgActive={getQRCodeSvgActive}
					svgInactive={getQRCodeSvgInactive}
					onPress={() => navigationRef.navigate("QRCode")}
					isActive={currentRoute === "QRCode"}
				/>
				<DockButton
					colors={colors}
					svgActive={getMapSvgActive}
					svgInactive={getMapSvgInactive}
					onPress={() => navigationRef.navigate("RefillMap")}
					isActive={currentRoute === "RefillMap"}
				/>
				<DockButton
					colors={colors}
					svgActive={getUserSvgActive}
					svgInactive={getUserSvgActive}
					onPress={() =>
						navigationRef.navigate("UserProfile", {
							answers: {},
							selectedProducts: [],
						})
					}
					isActive={currentRoute === "UserProfile"}
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
		width: "72%",
		height: 80,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		borderRadius: 40,
		paddingHorizontal: spacing.lg,
		overflow: "hidden",
		gap: 30,
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
