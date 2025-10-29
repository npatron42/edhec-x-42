import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { SvgXml } from "react-native-svg"
import { spacing, typography } from "../styles/theme"
import { AppIcon } from "../components/common"
import { useTheme } from "../styles/ThemeProvider"

const qrCodeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffa9df;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffb760;stop-opacity:1" />
    </linearGradient>
  </defs>
  <polygon fill="url(#qrGrad)" points="119.259,466.722 502.455,466.722 502.455,12.41 48.143,12.41 48.143,466.722 "/>
  <path fill="#2365A1" d="M102.156,377.185l-86.197,86.21c-8.565,8.565-8.578,22.462,0,31.04c8.578,8.578,22.475,8.565,31.04,0  l86.21-86.197"/>
  <circle fill="#2365A1" cx="200.837" cy="309.56" r="119.604"/>
  <circle fill="#f07e6e" cx="200.837" cy="309.56" r="84.581"/>
  <path d="M189.17,162.342c5.271,0,9.545-4.274,9.545-9.545v-92.89c0-5.271-4.274-9.545-9.545-9.545H96.28  c-5.271,0-9.545,4.274-9.545,9.545v92.89c0,5.271,4.274,9.545,9.545,9.545H189.17z M105.825,69.453h73.8v73.8h-73.8V69.453z" fill="#ffffff"/>
  <path d="M454.327,94.288c5.271,0,9.545-4.274,9.545-9.545V59.908c0-5.271-4.274-9.545-9.545-9.545h-92.89  c-5.271,0-9.545,4.274-9.545,9.545v92.89c0,5.271,4.274,9.545,9.545,9.545h92.89c5.271,0,9.545-4.274,9.545-9.545v-36.875  c0-5.271-4.274-9.545-9.545-9.545s-9.545,4.274-9.545,9.545v27.33h-73.8v-73.8h73.8v15.291  C444.782,90.015,449.056,94.288,454.327,94.288z" fill="#ffffff"/>
  <path d="M351.893,417.955c0,5.271,4.274,9.545,9.545,9.545h92.89c5.271,0,9.545-4.274,9.545-9.545v-92.89  c0-5.271-4.274-9.545-9.545-9.545h-92.89c-5.271,0-9.545,4.274-9.545,9.545V417.955z M370.982,334.61h73.8v73.8h-73.8V334.61z" fill="#ffffff"/>
</svg>
`

export default function Header({
	headerTitle,
	headerSubtitle,
	navigation,
	showQRIcon = false,
}) {
	const { colors } = useTheme()
	const styles = getStyles(colors)
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 4
	return (
		<LinearGradient
			colors={[colors.primary, colors.accent]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.heroBanner}
		>
			<View style={styles.heroHeaderRow}>
				<View style={styles.headerContent}>
					{showQRIcon ? (
						<View style={styles.qrIconContainer}>
							<SvgXml xml={qrCodeSvg} width={60} height={60} />
						</View>
					) : (
						<Text
							style={[
								styles.heroTitle,
								{ color: colors.onPrimaryText },
							]}
						>
							{headerTitle}
						</Text>
					)}
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
	const headerHeight = screenHeight / 4
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
		qrIconContainer: {
			alignItems: "center",
			justifyContent: "center",
			marginBottom: spacing.sm,
		},
	})
}
