export const colors = {
	primary: "#212F59",
	primaryDark: "#1D6FE3",
	primaryLight: "#8ABCFB",
	primarySoft: "rgba(79,156,249,0.12)",

	primaryBorder: "#d9c484",
	accent: "#395992",
	accentDark: "",
	accentLight: "#395992",

	background: "#F6FAFF",
	backgroundAlt: "#ECF3FF",
	// Glass surfaces
	surface: "rgba(255,255,255,0.70)",
	surfaceElevated: "rgba(255,255,255,0.82)",
	surfaceAlt: "rgba(255,255,255,0.65)",
	border: "rgba(15,23,42,0.08)",
	borderLight: "rgba(255,255,255,0.85)",
	// Text on vibrant/primary backgrounds (gradients, badges)
	onPrimaryText: "#FFFFFF",
	onPrimaryTextSoft: "rgba(255,255,255,0.9)",

	textPrimary: "#0F172A",
	textSecondary: "rgba(15,23,42,0.65)",
	textMuted: "rgba(15,23,42,0.45)",
	textInverse: "#ffffff",

	success: "#10B981",
	warning: "#F59E0B",
	danger: "#EF4444",
	info: "#3B82F6",

	gradientStart: "#4F9CF9",
	gradientEnd: "#22D3EE",
}

export const darkColors = {
	// Dark theme (softer, less black) + glass
	primary: "#60A5FA",
	primaryDark: "#3B82F6",
	primaryLight: "#93C5FD",
	primarySoft: "rgba(96,165,250,0.12)",

	accent: "#395992",
	accentDark: "#06B6D4",
	accentLight: "#67E8F9",

	background: "#101726",
	backgroundAlt: "#151F34",
	// Glass surfaces
	surface: "rgba(255,255,255,0.06)",
	surfaceElevated: "rgba(255,255,255,0.10)",
	surfaceAlt: "rgba(255,255,255,0.12)",
	border: "rgba(255,255,255,0.12)",
	borderLight: "rgba(255,255,255,0.08)",
	// Text on vibrant/primary backgrounds (gradients, badges)
	onPrimaryText: "#FFFFFF",
	onPrimaryTextSoft: "rgba(255,255,255,0.92)",

	textPrimary: "#E5E7EB",
	textSecondary: "rgba(229,231,235,0.7)",
	textMuted: "rgba(229,231,235,0.5)",
	textInverse: "#0B1220",

	success: "#10B981",
	warning: "#F59E0B",
	danger: "#F87171",
	info: "#60A5FA",

	gradientStart: "#0EA5E9",
	gradientEnd: "#22D3EE",
}

export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 32,
	xxxl: 48,
}

export const radius = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 32,
	xxxl: 60,
	full: 9999,
}

export const fontFamily = {
	roboto: {
		thin: "Roboto-Thin",
		thinItalic: "Roboto-ThinItalic",
		extraLight: "Roboto-ExtraLight",
		extraLightItalic: "Roboto-ExtraLightItalic",
		light: "Roboto-Light",
		lightItalic: "Roboto-LightItalic",
		regular: "Roboto-Regular",
		italic: "Roboto-Italic",
		medium: "Roboto-Medium",
		mediumItalic: "Roboto-MediumItalic",
		semiBold: "Roboto-SemiBold",
		semiBoldItalic: "Roboto-SemiBoldItalic",
		bold: "Roboto-Bold",
		boldItalic: "Roboto-BoldItalic",
		extraBold: "Roboto-ExtraBold",
		extraBoldItalic: "Roboto-ExtraBoldItalic",
		black: "Roboto-Black",
		blackItalic: "Roboto-BlackItalic",
	},
	robotoCondensed: {
		thin: "Roboto_Condensed-Thin",
		thinItalic: "Roboto_Condensed-ThinItalic",
		extraLight: "Roboto_Condensed-ExtraLight",
		extraLightItalic: "Roboto_Condensed-ExtraLightItalic",
		light: "Roboto_Condensed-Light",
		lightItalic: "Roboto_Condensed-LightItalic",
		regular: "Roboto_Condensed-Regular",
		italic: "Roboto_Condensed-Italic",
		medium: "Roboto_Condensed-Medium",
		mediumItalic: "Roboto_Condensed-MediumItalic",
		semiBold: "Roboto_Condensed-SemiBold",
		semiBoldItalic: "Roboto_Condensed-SemiBoldItalic",
		bold: "Roboto_Condensed-Bold",
		boldItalic: "Roboto_Condensed-BoldItalic",
		extraBold: "Roboto_Condensed-ExtraBold",
		extraBoldItalic: "Roboto_Condensed-ExtraBoldItalic",
		black: "Roboto_Condensed-Black",
		blackItalic: "Roboto_Condensed-BlackItalic",
	},
	robotoSemiCondensed: {
		thin: "Roboto_SemiCondensed-Thin",
		thinItalic: "Roboto_SemiCondensed-ThinItalic",
		extraLight: "Roboto_SemiCondensed-ExtraLight",
		extraLightItalic: "Roboto_SemiCondensed-ExtraLightItalic",
		light: "Roboto_SemiCondensed-Light",
		lightItalic: "Roboto_SemiCondensed-LightItalic",
		regular: "Roboto_SemiCondensed-Regular",
		italic: "Roboto_SemiCondensed-Italic",
		medium: "Roboto_SemiCondensed-Medium",
		mediumItalic: "Roboto_SemiCondensed-MediumItalic",
		semiBold: "Roboto_SemiCondensed-SemiBold",
		semiBoldItalic: "Roboto_SemiCondensed-SemiBoldItalic",
		bold: "Roboto_SemiCondensed-Bold",
		boldItalic: "Roboto_SemiCondensed-BoldItalic",
		extraBold: "Roboto_SemiCondensed-ExtraBold",
		extraBoldItalic: "Roboto_SemiCondensed-ExtraBoldItalic",
		black: "Roboto_SemiCondensed-Black",
		blackItalic: "Roboto_SemiCondensed-BlackItalic",
	},
}

export const typography = {
	h1: {
		fontSize: 32,
		fontFamily: fontFamily.roboto.bold,
		lineHeight: 40,
		letterSpacing: -0.5,
	},
	h2: {
		fontSize: 28,
		fontFamily: fontFamily.roboto.bold,
		lineHeight: 36,
		letterSpacing: -0.3,
	},
	h3: {
		fontSize: 24,
		fontFamily: fontFamily.roboto.semiBold,
		lineHeight: 32,
	},
	h4: {
		fontSize: 20,
		fontFamily: fontFamily.roboto.semiBold,
		lineHeight: 28,
	},
	// Body
	bodyLarge: {
		fontSize: 18,
		fontFamily: fontFamily.roboto.regular,
		lineHeight: 28,
	},
	body: {
		fontSize: 16,
		fontFamily: fontFamily.roboto.regular,
		lineHeight: 24,
	},
	bodySmall: {
		fontSize: 14,
		fontFamily: fontFamily.roboto.regular,
		lineHeight: 20,
	},
	label: {
		fontSize: 14,
		fontFamily: fontFamily.roboto.medium,
		lineHeight: 20,
	},
	labelSmall: {
		fontSize: 12,
		fontFamily: fontFamily.roboto.medium,
		lineHeight: 16,
		letterSpacing: 0.5,
	},
	caption: {
		fontSize: 12,
		fontFamily: fontFamily.roboto.regular,
		lineHeight: 16,
	},
}

export const fontHelpers = {
	text: (variant = "regular", style = "roboto") => ({
		fontFamily: fontFamily[style][variant],
	}),

	roboto: (variant = "regular") => ({
		fontFamily: fontFamily.roboto[variant],
	}),

	robotoCondensed: (variant = "regular") => ({
		fontFamily: fontFamily.robotoCondensed[variant],
	}),

	robotoSemiCondensed: (variant = "regular") => ({
		fontFamily: fontFamily.robotoSemiCondensed[variant],
	}),
}

// Convertit des valeurs d'ombres RN en boxShadow Web
const toBoxShadow = (color, offset, radius, elevation = 0) => {
	const { width, height } = offset || { width: 0, height: 0 }
	const blur = Math.max(1, Math.floor(radius))
	const spread = Math.max(0, Math.floor(elevation / 2))
	return `${width}px ${height}px ${blur}px ${spread}px ${color}`
}

export const shadow = {
	card: {
		shadowColor: "#00000040",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 24,
		elevation: 8,
	},
	soft: {
		// Subtle neon-like glow
		shadowColor: "#4F9CF980",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.35,
		shadowRadius: 20,
		elevation: 6,
	},
	strong: {
		shadowColor: "#22D3EE88",
		shadowOffset: { width: 0, height: 16 },
		shadowOpacity: 0.4,
		shadowRadius: 32,
		elevation: 12,
	},
}

export const withTheme = (isDark) => (isDark ? darkColors : colors)
