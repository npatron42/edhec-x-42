import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	FlatList,
	Keyboard,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { spacing, typography, radius } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"
import { MOCK_STATIONS } from "../../data/stations"
import { useState, useCallback, useRef } from "react"

const getSearchSvg = (primaryColor) => `
<?xml version="1.0" encoding="utf-8"?>
<svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
	<path d="M492.5 917.7c-247 0-447.9-200.9-447.9-447.9s200.9-448 447.9-448 447.9 200.9 447.9 447.9-200.9 448-447.9 448z m0-810.6c-200 0-362.6 162.7-362.6 362.6s162.7 362.6 362.6 362.6 362.6-162.7 362.6-362.6-162.6-362.6-362.6-362.6z" fill="#d9c586" />
	<path d="M951.1 971c-10.9 0-21.8-4.2-30.2-12.5l-96-96c-16.7-16.7-16.7-43.7 0-60.3 16.6-16.7 43.7-16.7 60.3 0l96 96c16.7 16.7 16.7 43.7 0 60.3-8.2 8.4-19.2 12.5-30.1 12.5z" fill="#212F59" />
</svg>
`

export default function DashboardHeaderSearch() {
	const { colors } = useTheme()
	const navigation = useNavigation()
	const styles = getStyles(colors)

	const [searchText, setSearchText] = useState("")
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [filteredStations, setFilteredStations] = useState([])
	const searchInputRef = useRef(null)

	const filterStations = useCallback((text) => {
		if (!text.trim()) {
			setFilteredStations([])
			return
		}

		const filtered = MOCK_STATIONS.filter((station) =>
			station.name.toLowerCase().includes(text.toLowerCase()),
		)
		setFilteredStations(filtered.slice(0, 5))
	}, [])

	const handleSearchChange = (text) => {
		setSearchText(text)
		filterStations(text)
	}

	const handleSearchFocus = () => {
		setIsSearchActive(true)
	}

	const handleSearchBlur = () => {
		setTimeout(() => {
			setIsSearchActive(false)
			if (!searchText.trim()) {
				setFilteredStations([])
			}
		}, 150)
	}

	const handleStationSelect = (station) => {
		setSearchText("")
		setFilteredStations([])
		setIsSearchActive(false)
		Keyboard.dismiss()

		navigation.navigate("RefillMap", {
			selectedStation: station,
			openStation: true,
		})
	}

	const clearSearch = () => {
		setSearchText("")
		setFilteredStations([])
		searchInputRef.current?.blur()
	}

	const renderStationSuggestion = ({ item }) => (
		<TouchableOpacity
			style={styles.suggestionItem}
			onPress={() => handleStationSelect(item)}
		>
			<View style={styles.suggestionIcon}>
				<SvgXml
					xml={getSearchSvg(colors.primary)}
					width={16}
					height={16}
				/>
			</View>
			<View style={styles.suggestionContent}>
				<Text style={styles.suggestionName}>{item.name}</Text>
				{item.type && (
					<Text style={styles.suggestionType}>{item.type}</Text>
				)}
			</View>
		</TouchableOpacity>
	)

	return (
		<View style={styles.container}>
			<View style={styles.searchBar}>
				<View style={styles.contentContainer}>
					<SvgXml
						xml={getSearchSvg(colors.primary)}
						width={24}
						height={24}
					/>
					<TextInput
						ref={searchInputRef}
						style={styles.searchInput}
						placeholder="Une borne Vaseline aux alentours?"
						placeholderTextColor={colors.textSecondary}
						value={searchText}
						onChangeText={handleSearchChange}
						onFocus={handleSearchFocus}
						onBlur={handleSearchBlur}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					{searchText.length > 0 && (
						<TouchableOpacity
							style={styles.clearButton}
							onPress={clearSearch}
						>
							<Text style={styles.clearButtonText}>×</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{isSearchActive && filteredStations.length > 0 && (
				<View style={styles.suggestionsContainer}>
					<FlatList
						data={filteredStations}
						keyExtractor={(item) => item.id}
						renderItem={renderStationSuggestion}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					/>
				</View>
			)}
		</View>
	)
}

const getStyles = (colors) => {
	return StyleSheet.create({
		container: {
			position: "relative",
			zIndex: 10,
		},
		searchBar: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "white",
			paddingVertical: 16,
			paddingHorizontal: spacing.xl,
			borderRadius: 44,
			elevation: 2,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 2,
		},
		contentContainer: {
			flexDirection: "row",
			alignItems: "center",
			flex: 1,
			gap: spacing.md,
		},
		searchInput: {
			...typography.body,
			color: colors.textPrimary,
			flex: 1,
			paddingVertical: 4,
			fontWeight: "200",
		},
		clearButton: {
			width: 24,
			height: 24,
			borderRadius: 12,
			backgroundColor: colors.surface,
			alignItems: "center",
			justifyContent: "center",
		},
		clearButtonText: {
			fontSize: 18,
			color: colors.textMuted,
			fontWeight: "300",
		},
		suggestionsContainer: {
			position: "absolute",
			top: "100%",
			left: 0,
			right: 0,
			backgroundColor: "white",
			borderRadius: radius.lg,
			marginTop: spacing.xs,
			elevation: 10,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.25,
			shadowRadius: 8,
			maxHeight: 200,
			zIndex: 11,
		},
		suggestionItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.lg,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		suggestionIcon: {
			marginRight: spacing.md,
		},
		suggestionContent: {
			flex: 1,
		},
		suggestionName: {
			...typography.bodySmall,
			color: colors.textPrimary,
			fontWeight: "500",
		},
		suggestionType: {
			...typography.caption,
			color: colors.textMuted,
			marginTop: 2,
		},
	})
}
