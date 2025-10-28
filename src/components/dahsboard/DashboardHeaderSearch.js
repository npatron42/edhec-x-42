import { View, Text, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"
import { spacing, typography, radius } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"

const getSearchSvg = (primaryColor) => `
<?xml version="1.0" encoding="utf-8"?>
<svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
	<path d="M492.5 917.7c-247 0-447.9-200.9-447.9-447.9s200.9-448 447.9-448 447.9 200.9 447.9 447.9-200.9 448-447.9 448z m0-810.6c-200 0-362.6 162.7-362.6 362.6s162.7 362.6 362.6 362.6 362.6-162.7 362.6-362.6-162.6-362.6-362.6-362.6z" fill="#d9c586" />
	<path d="M951.1 971c-10.9 0-21.8-4.2-30.2-12.5l-96-96c-16.7-16.7-16.7-43.7 0-60.3 16.6-16.7 43.7-16.7 60.3 0l96 96c16.7 16.7 16.7 43.7 0 60.3-8.2 8.4-19.2 12.5-30.1 12.5z" fill="#212F59" />
</svg>
`

export default function DashboardHeaderSearch() {
	const colors = useTheme()
	const styles = getStyles(colors)

	return (
		<View style={styles.searchBar}>
			<View style={styles.contentContainer}>
				<SvgXml
					xml={getSearchSvg(colors.primary)}
					width={28}
					height={28}
				/>
				<Text style={styles.searchText}>Une borne Vaseline aux alentours?</Text>
			</View>
		</View>
	)
}

const getStyles = (colors) => {
	return StyleSheet.create({
		searchBar: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "white",
			paddingVertical: 20,
			paddingHorizontal: spacing.xl,
			borderRadius: 44,
		},
		contentContainer: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.md,
		},
		searchText: {
			...typography.body,
			color: colors.textSecondary,
			fontWeight: "200",
		},
	})
}
