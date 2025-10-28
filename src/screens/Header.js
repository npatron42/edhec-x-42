import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { spacing, typography } from "../styles/theme"
import { AppIcon } from "../components/common"
import { useTheme } from "../styles/ThemeProvider"

export default function Header({ headerTitle, headerSubtitle, navigation }) {
	const { colors } = useTheme()
	const styles = getStyles(colors)
	return (
		<LinearGradient
			colors={[colors.primary, colors.accent]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroBanner}
		>
			<View style={styles.heroHeaderRow}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					accessibilityRole="button"
					accessibilityLabel="Retour"
				>
					<AppIcon
						name="arrow-back"
						provider="Ionicons"
						size={20}
						color={colors.onPrimaryText}
						style={{ marginTop: 54 }}
					/>
				</TouchableOpacity>
				<View
					style={{
						marginLeft: spacing.sm,
						marginTop: 54,
						marginLeft: 14,
					}}
				>
					<Text
						style={[
							styles.heroTitle,
							{ color: colors.onPrimaryText },
						]}
					>
						{headerTitle}
					</Text>
					<Text
						style={[
							styles.heroSubtitle,
							{ color: colors.onPrimaryTextSoft },
						]}
					>
						{headerSubtitle}
					</Text>
				</View>
			</View>
		</LinearGradient>
	)
}

const getStyles = (colors) =>
	StyleSheet.create({
		heroBanner: {
			top: -60,
			height: 140,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.xl,
			backgroundColor: colors.primary,
		},
		heroHeaderRow: { flexDirection: "row", alignItems: "center" },
		heroTitle: { fontSize: 18, fontWeight: "700" },
		heroSubtitle: { ...typography.bodySmall },
	})
