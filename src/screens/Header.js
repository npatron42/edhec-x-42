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

const mapSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="mapGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffb760;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f07e6e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="mapGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ba577b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2365A1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path d="M786 279l-48-13 48-13 13-48 13 48 49 13-49 13-13 49-13-49zM834 332l-19-4 19-5 4-19 5 19 19 5-19 4-5 19-4-19z" fill="url(#mapGrad1)"/>
  <path d="M159 715l-21-5 21-5 5-21 5 21 21 5-21 5-5 21-5-21z" fill="url(#mapGrad1)"/>
  <path d="M244 247m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0Z" fill="#ffa9df"/>
  <path d="M288 821l-27-6 27-7 6-27 7 27 27 7-27 6-7 27-6-27z" fill="url(#mapGrad1)"/>
  <path d="M832 828a25 25 0 1 1 25-25 25 25 0 0 1-25 25z m0-36a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" fill="#ba577b"/>
  <path d="M627 502l-10-17 11-7V287l-22 14a95 95 0 0 1 3 24c0 28-19 64-58 108 21 7 34 19 34 34s-31 40-71 40-71-17-71-40 13-27 34-34l-25-30-40 26v180h2l11-7 11 17-17 10h-7v112l216-102V501z m-135 83l-16 10-8 5-8 5h-1l-5-9-5-8 9-5 24-15 10 17z m56-35l-33 20-10-17 33-20 10 17z m56-35l-33 20-10-17 17-10 16-10 10 17zM188 640l204 99V427L188 296z m162-74l32 22-11 16-32-22z m-57-31l4-5 8 6 23 16-11 16-15-11-8-6-8-6z m-42-45a29 29 0 1 1-29 29 29 29 0 0 1 30-29zM648 477l12 6-9 18-3-2v141l217 95V428L648 285z m176 68a29 29 0 1 1-29 29 29 29 0 0 1 29-29z m-72-15l36 19-9 18-36-18z m-69-23l5-10 9 4 9 4 18 9-9 18-27-14-9-4z" fill="#ffb760" opacity="0.8"/>
  <path d="M640 256l-41 27a95 95 0 0 0-181 43c0 17 7 38 22 61l-37 24-235-151v392l236 115 233-110 248 108V417z m-202 69a75 75 0 0 1 151 0c0 33-40 81-75 118-62-63-76-99-76-118z m97 124c18 4 29 12 29 18s-20 20-51 20-51-12-51-20s11-14 29-18l15 15 7 7 7-7zM392 739l-204-99V296l204 131z m20 2V630h7l17-10-11-17-11 7h-2V429l40-26 25 30c-21 7-34 19-34 34s31 40 71 40 71-17 71-40-13-27-34-34c39-44 58-80 58-108a95 95 0 0 0-3-24l22-14v190l-11 7 10 17h1v138z m453-6l-217-95V499l3 2 9-18-12-6V285l217 143z" fill="url(#mapGrad2)"/>
  <path d="M286 546l8 5 8 6 15 11 12-17-24-16-8-6-4 5-7 12zM371 604l11-16-32-22-11 16 32 22zM481 568l-24 15-9 5 1 1h-1l5 8 5 9v-1l1 1 8-5 9-5h-1l17-11-11-17zM537 534l-33 20 11 17 33-20-10-17h-1zM594 499l-16 10-17 10 10 17 33-20-10-17zM679 515l9 4 27 14 9-17v-1l-18-9-9-4-9-5-5 10-4 8zM779 566l9-18-36-18-9 17v1l36 18z" fill="#ba577b"/>
  <path d="M824 585a11 11 0 1 0-11-11 11 11 0 0 0 11 11z" fill="#f07e6e"/>
  <path d="M824 603a29 29 0 1 0-29-29 29 29 0 0 0 29 29z m0-40a11 11 0 1 1-11 11 11 11 0 0 1 11-11z" fill="#ba577b"/>
  <path d="M252 530a11 11 0 1 0-11-11 11 11 0 0 0 11 11z" fill="#ffa9df"/>
  <path d="M252 548a29 29 0 1 0-29-29 29 29 0 0 0 29 29z m0-40a11 11 0 1 1-11 11 11 11 0 0 1 11-11z" fill="#ba577b"/>
  <path d="M507 465l-15-15c-18 4-29 12-29 18s20 20 51 20 51-12 51-20-11-14-29-18l-15 15-7 7z" fill="#ffa9df" opacity="0.8"/>
  <path d="M514 444c36-37 75-85 75-118a75 75 0 0 0-151 0c0 18 14 54 76 118z m-35-117a35 35 0 1 1 35 35 35 35 0 0 1-35-35z" fill="url(#mapGrad1)"/>
  <path d="M514 327m-35 0a35 35 0 1 0 70 0 35 35 0 1 0-70 0Z" fill="#ffffff"/>
</svg>
`

export default function Header({
	headerTitle,
	headerSubtitle,
	navigation,
	showQRIcon = false,
	showMapIcon = false,
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
					) : showMapIcon ? (
						<View style={styles.qrIconContainer}>
							<SvgXml xml={mapSvg} width={120} height={120} />
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
		qrIconContainer: {
			alignItems: "center",
			justifyContent: "center",
			marginBottom: spacing.sm,
		},
	})
}
