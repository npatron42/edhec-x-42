import React, { useEffect, useState, useRef } from "react"
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Platform,
	Modal,
	FlatList,
	TouchableOpacity,
	Dimensions,
} from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import * as Device from "expo-device"
import { AppButton, AppIcon } from "../components/common"
import { spacing, radius, shadow, typography } from "../styles/theme"
import { doveProducts } from "../data/products"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../styles/ThemeProvider"
import Header from "./Header"
import { MOCK_STATIONS } from "../data/stations"

// EDHEC Business School Nice coordinates (mise à jour)
const EDHEC_NICE_COORDS = { latitude: 43.669632, longitude: 7.221006 }

// Position par défaut de l'app (fallback + émulateur si position par défaut)
const DEFAULT_COORDS = EDHEC_NICE_COORDS

// Bornes approximatives de la position par défaut des émulateurs (San Francisco)
const SF_BOUNDS = {
	latMin: 37.7,
	latMax: 37.85,
	lonMin: -122.52,
	lonMax: -122.35,
}
const isLikelySanFrancisco = (coords) =>
	!!coords &&
	coords.latitude >= SF_BOUNDS.latMin &&
	coords.latitude <= SF_BOUNDS.latMax &&
	coords.longitude >= SF_BOUNDS.lonMin &&
	coords.longitude <= SF_BOUNDS.lonMax

export default function RefillMapScreen({ route, navigation }) {
	const { colors } = useTheme()
	const styles = getStyles(colors)

	const selectedProducts = route?.params?.selectedProducts || []
	const selectedStation = route?.params?.selectedStation
	const shouldOpenStation = route?.params?.openStation || false
	const screenHeight = Dimensions.get("screen").height
	const headerHeight = screenHeight / 4
	const footerHeight = 80
	const headerSpacer = Math.max(headerHeight - spacing.xl, spacing.lg)
	const contentBottomInset = footerHeight + spacing.xl
	const mapHeight = Math.min(screenHeight * 0.55, 520)
	const [location, setLocation] = useState(null)
	const [region, setRegion] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// État pour le modal de borne
	const [stationModalVisible, setStationModalVisible] = useState(false)
	const [activeStation, setActiveStation] = useState(null)
	const [stationInventory, setStationInventory] = useState([])

	const mapRef = useRef(null)

	// Génère une liste stable de produits pour une borne (mock)
	const pickInventoryForStation = (station, count = 6) => {
		const pool = doveProducts || []
		if (!pool.length) return []
		let seed = (station?.id || "S")
			.split("")
			.reduce((acc, c) => acc + c.charCodeAt(0), 0)
		const used = new Set()
		const items = []
		while (items.length < Math.min(count, pool.length)) {
			seed = (seed * 9301 + 49297) % 233280
			const idx = seed % pool.length
			if (!used.has(idx)) {
				used.add(idx)
				items.push(pool[idx])
			}
		}
		return items
	}

	const handleOpenStation = (station) => {
		const inv = pickInventoryForStation(station, 6)
		setActiveStation(station)
		setStationInventory(inv)
		setStationModalVisible(true)
	}

	// Bouton personnalisé "me localiser"
	const recenterToUser = async () => {
		try {
			const { status } = await Location.getForegroundPermissionsAsync()
			if (status !== Location.PermissionStatus.GRANTED) {
				const req = await Location.requestForegroundPermissionsAsync()
				if (req.status !== Location.PermissionStatus.GRANTED) {
					// Pas de permission → EDHEC
					const region = {
						...DEFAULT_COORDS,
						latitudeDelta: 0.08,
						longitudeDelta: 0.08,
					}
					setRegion(region)
					mapRef.current?.animateToRegion(region, 600)
					return
				}
			}

			const loc = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
				timeout: 8000,
			})
			let coords = {
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,
			}
			// Si simulateur avec SF → utiliser EDHEC
			const isEmulator = !Device.isDevice
			if (isEmulator && isLikelySanFrancisco(coords)) {
				coords = DEFAULT_COORDS
			}
			const region = {
				...coords,
				latitudeDelta: 0.08,
				longitudeDelta: 0.08,
			}
			setLocation(coords)
			setRegion(region)
			mapRef.current?.animateToRegion(region, 600)
		} catch (e) {
			const region = {
				...DEFAULT_COORDS,
				latitudeDelta: 0.08,
				longitudeDelta: 0.08,
			}
			setRegion(region)
			mapRef.current?.animateToRegion(region, 600)
		}
	}

	const closeStationModal = () => {
		setStationModalVisible(false)
		setActiveStation(null)
		setStationInventory([])
	}

	useEffect(() => {
		if (selectedStation && shouldOpenStation) {
			setTimeout(() => {
				const stationCoords = selectedStation.coords
				const newRegion = {
					latitude: stationCoords.latitude,
					longitude: stationCoords.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				}

				setRegion(newRegion)
				mapRef.current?.animateToRegion(newRegion, 1000)

				setTimeout(() => {
					handleOpenStation(selectedStation)
				}, 1200)
			}, 500)
		}
	}, [selectedStation, shouldOpenStation])

	useEffect(() => {
		let isMounted = true
		;(async () => {
			try {
				const isEmulator = !Device.isDevice

				console.log("📍 Demande de localisation GPS...")
				console.log(
					isEmulator
						? "🖥️  Mode: Émulateur"
						: "📱 Mode: Appareil physique",
				)

				// Always request GPS location (works on both emulator and real device)
				const { status } =
					await Location.requestForegroundPermissionsAsync()

				if (!isMounted) return

				if (status !== Location.PermissionStatus.GRANTED) {
					console.log(
						"⚠️ Permission de localisation refusée - utilisation de Nice comme fallback",
					)
					if (isMounted) {
						setError("Permission de localisation refusée")
						setLocation(DEFAULT_COORDS)
						setRegion({
							...DEFAULT_COORDS,
							latitudeDelta: 0.08,
							longitudeDelta: 0.08,
						})
						setLoading(false)
					}
					return
				}

				console.log(
					"✅ Permission accordée - récupération de la position GPS...",
				)

				const loc = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
					timeout: 10000, // 10 secondes max
				})

				if (!isMounted) return

				let coords = {
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
				}

				if (isEmulator && isLikelySanFrancisco(coords)) {
					console.log(
						"🧭 Émulateur avec position par défaut (San Francisco) détectée → utilisation EDHEC Nice",
					)
					coords = DEFAULT_COORDS
				}

				console.log(
					`✅ Position GPS obtenue: ${coords.latitude.toFixed(
						4,
					)}, ${coords.longitude.toFixed(4)}`,
				)

				setLocation(coords)
				setRegion({
					...coords,
					latitudeDelta: 0.08,
					longitudeDelta: 0.08,
				})

				// Clear any previous error
				setError(null)
			} catch (err) {
				if (!isMounted) return
				console.log("⚠️ Erreur de localisation:", err.message)
				console.log(
					"📍 Utilisation de la position par défaut: EDHEC Nice",
				)

				// Fallback to Nice if GPS fails
				setError(
					"Localisation GPS indisponible - utilisation EDHEC Nice",
				)
				setLocation(DEFAULT_COORDS)
				setRegion({
					...DEFAULT_COORDS,
					latitudeDelta: 0.08,
					longitudeDelta: 0.08,
				})
			} finally {
				if (isMounted) setLoading(false)
			}
		})()
		return () => {
			isMounted = false
		}
	}, [])

	const openQRCode = () => navigation.navigate("QRCode", { selectedProducts })

	return (
		<View style={styles.container}>
			<Header
				headerTitle="Bornes de rechargement"
				headerSubtitle="Localiser les bornes autour de vous!"
				navigation={navigation}
			/>
			<SafeAreaView style={styles.safeArea} edges={["bottom"]}>
				<View
					style={[
						styles.content,
						{
							paddingTop: headerSpacer,
							paddingBottom: contentBottomInset,
						},
					]}
				>
					<View style={styles.mapContainer}>
						<View
							style={[styles.mapWrapper, { height: mapHeight }]}
						>
							{loading ? (
								<View style={styles.loader}>
									<ActivityIndicator color={colors.primary} />
									<Text style={styles.loaderText}>
										Localisation en cours…
									</Text>
								</View>
							) : (
								<MapView
									ref={mapRef}
									style={styles.map}
									provider={PROVIDER_GOOGLE}
									initialRegion={
										region || {
											...DEFAULT_COORDS,
											latitudeDelta: 0.08,
											longitudeDelta: 0.08,
										}
									}
									onRegionChangeComplete={setRegion}
									showsUserLocation={!!location}
									followsUserLocation={false}
									showsMyLocationButton={false}
								>
									{MOCK_STATIONS.map((station) => (
										<Marker
											key={station.id}
											coordinate={station.coords}
											title={station.name}
											description={`Type: ${
												station.type || "Supermarché"
											}`}
											pinColor={colors.primary}
											onPress={() =>
												handleOpenStation(station)
											}
										/>
									))}
								</MapView>
							)}

							{/* Bouton personnalisé de localisation */}
							{!loading ? (
								<View style={styles.locateFab}>
									<TouchableOpacity
										style={styles.locateButton}
										onPress={recenterToUser}
										accessibilityLabel="Me localiser"
									>
										<AppIcon
											name="crosshairs-gps"
											provider="MaterialCommunityIcons"
											size={22}
											color={colors.background}
										/>
									</TouchableOpacity>
								</View>
							) : null}
						</View>
					</View>

					{Platform.OS === "web" ? (
						<View style={styles.webHelp}>
							<Text style={styles.webHelpText}>
								Si la carte ne s'affiche pas, vérifiez les
								permissions de localisation du navigateur.
							</Text>
						</View>
					) : null}
					{error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : null}
				</View>
				<Modal
					visible={stationModalVisible}
					transparent
					animationType="slide"
					onRequestClose={closeStationModal}
				>
					<View style={styles.modalBackdrop}>
						<View style={styles.modalSheet}>
							<View style={styles.modalHandle} />
							<Text style={styles.modalTitle}>
								{activeStation?.name || "Borne"}
							</Text>
							<Text style={styles.modalSubtitle}>
								Produits disponibles
							</Text>
							<FlatList
								data={stationInventory}
								keyExtractor={(item) =>
									`station-prod-${activeStation?.id}-${item.id}`
								}
								contentContainerStyle={{
									paddingBottom: spacing.lg,
								}}
								renderItem={({ item }) => (
									<View style={styles.productRow}>
										<Text style={styles.productEmoji}>
											{item.image || "🧴"}
										</Text>
										<View style={styles.productInfo}>
											<Text style={styles.productName}>
												{item.name}
											</Text>
											<Text style={styles.productDetails}>
												{(item.benefits || [])
													.slice(0, 2)
													.join(" • ")}
											</Text>
										</View>
									</View>
								)}
							/>
							<View style={styles.modalActions}>
								<AppButton
									label="Fermer"
									variant="outline"
									onPress={closeStationModal}
								/>
							</View>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		</View>
	)
}

const getStyles = (c) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: c.background,
		},
		safeArea: {
			flex: 1,
			backgroundColor: c.background,
		},
		content: {
			flex: 1,
			paddingHorizontal: spacing.xl,
			gap: spacing.lg,
		},
		mapContainer: {
			flexGrow: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		mapWrapper: {
			width: "100%",
			maxWidth: 620,
			alignSelf: "stretch",
			borderRadius: radius.xxl,
			borderWidth: 3,
			borderColor: c.primaryBorder,
			overflow: "hidden",
			backgroundColor: c.background,
			...shadow.soft,
		},
		map: { flex: 1 },
		loader: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: spacing.xl,
		},
		loaderText: {
			marginTop: spacing.sm,
			color: c.textMuted,
		},
		webHelp: {
			padding: spacing.md,
			backgroundColor: c.surface,
			borderRadius: radius.md,
		},
		webHelpText: {
			...typography.bodySmall,
			color: c.textMuted,
			textAlign: "center",
		},
		errorText: {
			...typography.bodySmall,
			color: c.error,
			textAlign: "center",
			padding: spacing.md,
		},
		modalBackdrop: {
			flex: 1,
			backgroundColor: "rgba(0,0,0,0.5)",
			justifyContent: "flex-end",
		},
		modalSheet: {
			backgroundColor: c.background,
			borderTopLeftRadius: radius.xl,
			borderTopRightRadius: radius.xl,
			paddingTop: spacing.sm,
			paddingHorizontal: spacing.xl,
			paddingBottom: spacing.lg,
			borderWidth: 1,
			borderColor: c.border,
			...shadow.soft,
		},
		modalHandle: {
			alignSelf: "center",
			width: 42,
			height: 4,
			borderRadius: 2,
			backgroundColor: c.textMuted,
			opacity: 0.35,
			marginBottom: spacing.sm,
		},
		modalTitle: { fontWeight: "700", color: c.textPrimary, fontSize: 16 },
		modalSubtitle: {
			color: c.textMuted,
			marginTop: 2,
			marginBottom: spacing.md,
		},
		productRow: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: spacing.sm,
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: c.border,
		},
		productEmoji: { fontSize: 22, marginRight: spacing.md },
		productInfo: { flex: 1 },
		productName: { color: c.textPrimary, fontWeight: "600" },
		productDetails: { color: c.textMuted, marginTop: 2 },
		modalActions: { marginTop: spacing.md },
		locateFab: {
			position: "absolute",
			right: spacing.xl,
			bottom: spacing.xxl,
		},
		locateButton: {
			width: 48,
			height: 48,
			borderRadius: 24,
			backgroundColor: c.primary,
			alignItems: "center",
			justifyContent: "center",
			...shadow.soft,
		},
	})
