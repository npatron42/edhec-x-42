import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { spacing, typography } from "../styles/theme"
import { AppIcon } from "../components/common"
import { useTheme } from "../styles/ThemeProvider"

export default function Header({ headerTitle, headerSubtitle, navigation }) {
	const { colors } = useTheme()
	const styles = getStyles(colors)
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 6
	return (
		<LinearGradient
			colors={[colors.primary, colors.accent]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroBanner}
		>
			<View style={styles.heroHeaderRow}>
				<View style={styles.headerContent}>
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

const getStyles = (colors) => {
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 5
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
		heroHeaderRow: {
			position: "absolute",
			top: 54,
			left: 0,
			right: 0,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: spacing.xl,
		},
		headerContent: {
			paddingTop: spacing.xl,
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
		},
		heroTitle: {
			...typography.h4,
			color: "white",
			fontWeight: "700",
			textAlign: "center",
			marginBottom: spacing.xs,
			width: "100%",
		},
		heroSubtitle: {
			...typography.body,
			color: "white",
			textAlign: "center",
			fontWeight: "300",
			opacity: 0.9,
			width: "100%",
			lineHeight: 20,
		},
	})
}
