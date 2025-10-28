// ##
// # Copyright (c) 2025 - Indigen Solutions
// # Authors:
// #   - Nicolas Patron <nicolas.patron@indigen.com>
// # NOTICE: All information contained herein is, and remains
// # the property of Indigen Solutions and its suppliers, if any.
// # Dissemination of this information or reproduction of this material
// # is strictly forbidden unless prior written permission is obtained
// # from Indigen Solutions.

import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	StatusBar,
} from "react-native"

import { LinearGradient } from "expo-linear-gradient"
import { spacing } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"

export default function DahsboardHeader() {
	const colors = useTheme()
	const styles = getStyles(colors)
	return (
		<LinearGradient
			colors={[colors.primary, colors.accent]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroBanner}
		>
			<View style={styles.heroHeaderRow}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>Dashboard</Text>
				</View>
			</View>
		</LinearGradient>
	)
}

const getStyles = (colors) => {
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 4
	const statusBarHeight = StatusBar.currentHeight || 0
	const safeTopPadding = statusBarHeight + 50

	return StyleSheet.create({
		heroBanner: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			height: headerHeight,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.xl,
			paddingTop: safeTopPadding,
			backgroundColor: "#212F59",
			borderBottomLeftRadius: 16,
			borderBottomRightRadius: 16,
			zIndex: 1000,
		},
		heroHeaderRow: {
			flexDirection: "row",
			alignItems: "center",
		},
		titleContainer: {
			flex: 1,
			alignItems: "center",
			marginRight: 24,
		},
		title: {
			fontSize: 20,
			fontWeight: "600",
			color: colors.onPrimaryText,
		},
	})
}
