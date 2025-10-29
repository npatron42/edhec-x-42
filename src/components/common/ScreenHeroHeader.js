import React, { useMemo } from "react"
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AppIcon } from "./index"
import { spacing, typography } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"

export const HERO_HEADER_HEIGHT =
	Dimensions.get("screen").height / 3.8

function renderText(content, style) {
	if (!content) return null
	if (typeof content === "string") {
		return <Text style={style}>{content}</Text>
	}
	return content
}

export default function ScreenHeroHeader({
	title,
	subtitle,
	onBackPress,
	leading,
	trailing,
	children,
	align = "center",
}) {
	const { colors } = useTheme()
	const insets = useSafeAreaInsets()
	const styles = useMemo(
		() => getStyles(colors, insets, align),
		[colors, insets, align],
	)

	const showBack = !!onBackPress && !leading

	return (
		<LinearGradient
			colors={[colors.primary, colors.accent]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroBanner}
		>
			<View style={styles.inner}>
				<View style={styles.topRow}>
					<View style={styles.sideSlot}>
						{leading || (showBack ? (
							<TouchableOpacity
								onPress={onBackPress}
								style={styles.backButton}
								accessibilityRole="button"
								accessibilityLabel="Retour"
							>
								<AppIcon
									name="chevron-back"
									provider="Ionicons"
									size={20}
									color={colors.onPrimaryText}
								/>
							</TouchableOpacity>
						) : null)}
					</View>
					<View style={styles.centerContent}>
						{renderText(title, styles.title)}
						{renderText(subtitle, styles.subtitle)}
					</View>
					<View style={styles.sideSlot}>
						{trailing || null}
					</View>
				</View>
				{children ? (
					<View style={styles.bottomSlot}>{children}</View>
				) : null}
			</View>
		</LinearGradient>
	)
}

const getStyles = (colors, insets, align) =>
	StyleSheet.create({
		heroBanner: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			height: HERO_HEADER_HEIGHT,
			borderBottomLeftRadius: 40,
			borderBottomRightRadius: 40,
			zIndex: 1000,
			overflow: "hidden",
		},
		inner: {
			flex: 1,
			paddingTop: insets.top + spacing.lg,
			paddingHorizontal: spacing.xl,
		},
		topRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		sideSlot: {
			width: 48,
			alignItems: "flex-start",
		},
		backButton: {
			width: 36,
			height: 36,
			borderRadius: 18,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "rgba(255,255,255,0.12)",
		},
		centerContent: {
			flex: 1,
			alignItems:
				align === "left"
					? "flex-start"
					: align === "right"
						? "flex-end"
						: "center",
		},
		title: {
			...typography.body,
			color: colors.onPrimaryText,
			textAlign: align,
			marginBottom: spacing.xs,
			width: "100%",
		},
		subtitle: {
			...typography.bodySmall,
			color: colors.onPrimaryTextSoft,
			textAlign: align,
			opacity: 0.9,
			width: "100%",
		},
		bottomSlot: {
			marginTop: spacing.lg,
			width: "100%",
		},
	})
