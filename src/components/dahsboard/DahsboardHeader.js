// ##
// # Copyright (c) 2025 - Indigen Solutions
// # Authors:
// #   - Nicolas Patron <nicolas.patron@indigen.com>
// # NOTICE: All information contained herein is, and remains
// # the property of Indigen Solutions and its suppliers, if any.
// # Dissemination of this information or reproduction of this material
// # is strictly forbidden unless prior written permission is obtained
// # from Indigen Solutions.

import { View, Text, StyleSheet, Dimensions, StatusBar } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { LinearGradient } from "expo-linear-gradient"
import { SvgXml } from "react-native-svg"
import { spacing, typography, fontFamily } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"
import { useState, useEffect } from "react"

import { getUserProfile } from "../../utils/storage"
import DashboardHeaderSearch from "./DashboardHeaderSearch"

const locationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
	<path fill="white" d="M12,1.006C8.2,1.006,3.754,3.36,3.754,10c0,6.53,7.6,12.63,7.926,12.887a.517.517,0,0,0,.64,0c.324-.257,7.926-6.357,7.926-12.887C20.246,3.36,15.8,1.006,12,1.006Zm0,20.8C10.563,20.58,4.785,15.309,4.785,10c0-5.875,3.887-7.96,7.215-7.96S19.215,4.121,19.215,10C19.215,15.3,13.437,20.578,12,21.808Z"/>
	<path fill="white" d="M14.334,6.288h0A2.177,2.177,0,0,0,12,6.726a2.177,2.177,0,0,0-2.334-.438A2.452,2.452,0,0,0,8.287,7.925a2.166,2.166,0,0,0,.375,1.852,40.722,40.722,0,0,0,2.994,2.905.514.514,0,0,0,.688,0,40.722,40.722,0,0,0,2.994-2.905,2.166,2.166,0,0,0,.375-1.852A2.452,2.452,0,0,0,14.334,6.288Zm.188,2.86A34.288,34.288,0,0,1,12,11.6,34.288,34.288,0,0,1,9.478,9.148a1.145,1.145,0,0,1-.19-.977,1.427,1.427,0,0,1,.808-.946c.759-.348,1.4.5,1.506.543a.533.533,0,0,0,.8,0c.008-.009.743-.894,1.506-.543a1.427,1.427,0,0,1,.808.946A1.145,1.145,0,0,1,14.522,9.148Z"/>
</svg>
`

export default function DahsboardHeader() {
	const colors = useTheme()
	const [userProfile, setUserProfile] = useState(null)
	const insets = useSafeAreaInsets()
	const styles = getStyles(colors, insets)
	useEffect(() => {
		const loadUserProfile = async () => {
			const profile = await getUserProfile()
			setUserProfile(profile)
		}
		loadUserProfile()
	}, [])
	return (
		<LinearGradient
			colors={[colors.primary, colors.accent]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroBanner}
		>
			<View style={styles.titleContainer}>
				<Text style={styles.greeting}>
					Bonjour, {userProfile?.name}!
				</Text>
				<View style={styles.locationContainer}>
					<Text style={styles.location}>Nice, 06100</Text>
					<SvgXml xml={locationSvg} width={24} height={24} />
				</View>
			</View>
			<View style={styles.searchContainer}>
				<DashboardHeaderSearch />
			</View>
		</LinearGradient>
	)
}

const getStyles = (colors, insets) => {
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 3.8

	return StyleSheet.create({
		heroBanner: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			height: headerHeight,
			backgroundColor: "#212F59",
			borderBottomLeftRadius: 40,
			borderBottomRightRadius: 40,
			zIndex: 1000,
		},
		titleContainer: {
			position: "absolute",
			top: insets.top,
			left: 0,
			right: 0,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: spacing.xl,
		},
		title: {
			...typography.h4,
			color: colors.onPrimaryText,
		},
		greeting: {
			...typography.body,
			color: "white",
			marginTop: 8,
			textAlign: "center",
			fontWeight: "300",
			width: "100%",
		},
		locationContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginTop: 8,
		},
		location: {
			fontSize: 28,
			fontFamily: fontFamily.roboto.semiBold,
			fontWeight: "bold",
			color: "white",
			marginRight: 8,
		},
		searchContainer: {
			position: "absolute",
			bottom: 30,
			left: spacing.xl,
			right: spacing.xl,
		},
	})
}
