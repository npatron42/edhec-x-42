import { View, StyleSheet } from "react-native"
import { spacing, radius } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"

export default function DashboardGrid() {
	const colors = useTheme()
	const styles = getStyles(colors)

	return (
		<View style={styles.container}>
			<View style={styles.grid}>
				<View style={[styles.gridItem, { backgroundColor: "white" }]} />
				<View style={styles.gridItem} />
				<View style={styles.gridItem} />
				<View style={styles.gridItem} />
				<View style={styles.gridItem} />
				<View style={styles.gridItem} />
			</View>
		</View>
	)
}

const getStyles = (colors) => {
	return StyleSheet.create({
		container: {
			padding: spacing.md,
		},
		grid: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: spacing.xs,
		},
		gridItem: {
			width: "30%",
			height: 120,
			backgroundColor: "#ffffff",
			borderRadius: radius.md,
			overflow: "hidden",
		},
	})
}
