import { View, StyleSheet, TouchableOpacity, Text } from "react-native"

import { LinearGradient } from "expo-linear-gradient"
import Svg, { Path, G, Circle, Line } from "react-native-svg"

import { spacing, radius } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"
import AppIcon from "../common/AppIcon"
import { useNavigation } from '@react-navigation/native'
import ScanSkinCard from "./ScanSkinCard"

const EcologyIcon = ({ color = "#000000", size = 32 }) => (
	<Svg width={size} height={size} viewBox="0 0 56 56">
		<G>
			<Path
				d="M18.9,25.5C18.9,25.5,18.9,25.5,18.9,25.5C18.9,25.6,18.9,25.6,18.9,25.5c2.3,2.5,5.6,4.1,9.1,4.1c3.6,0,6.8-1.6,9-4 c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0,0c1.9-2.2,3.1-5,3.1-8.1C40.3,10.5,34.8,5,28,5c-3.7,0-7.1,1.7-9.3,4.3c0,0-0.1,0-0.1,0.1 c0,0,0,0,0,0c-1.8,2.1-2.9,4.9-2.9,7.9C15.7,20.5,16.9,23.3,18.9,25.5z M19.7,11.3c1,0.6,2.2,1.1,3.4,1.5c-0.2,1.1-0.3,2.3-0.4,3.6 h-4.9C17.9,14.4,18.6,12.7,19.7,11.3z M38.2,16.3h-4.9c0-1.2-0.2-2.4-0.4-3.5c1.3-0.3,2.4-0.8,3.5-1.4 C37.4,12.8,38.1,14.5,38.2,16.3z M36.1,23.6c-0.9-0.5-2-0.9-3.2-1.3c0.2-1.3,0.4-2.6,0.4-4h4.9C38,20.3,37.3,22.1,36.1,23.6z M25,13.2c1,0.2,2.1,0.3,3.1,0.3c1,0,1.9-0.1,2.9-0.2c0.2,0.9,0.3,2,0.3,3.1h-6.6C24.8,15.2,24.9,14.1,25,13.2z M25.5,11.2 c0.7-2.5,1.7-4,2.5-4c0.8,0,1.9,1.5,2.6,4C28.9,11.5,27.1,11.5,25.5,11.2z M31.3,18.3c0,1.3-0.2,2.5-0.4,3.6c-1-0.2-2-0.2-3.1-0.2 c-1,0-1.9,0.1-2.8,0.3c-0.2-1.1-0.3-2.3-0.4-3.7H31.3z M24.7,27c-1.2-0.4-2.3-1.1-3.3-1.9c0.6-0.3,1.4-0.6,2.2-0.8 C23.9,25.3,24.2,26.2,24.7,27z M25.5,23.9c0.8-0.1,1.6-0.2,2.4-0.2c0.9,0,1.7,0.1,2.6,0.2c-0.7,2.3-1.7,3.7-2.5,3.7 C27.2,27.6,26.2,26.3,25.5,23.9z M32.4,24.3c0.9,0.2,1.6,0.5,2.3,0.8c-1,0.8-2.1,1.5-3.4,1.9C31.8,26.2,32.1,25.3,32.4,24.3z M32.5,10.9c-0.3-1.3-0.8-2.4-1.3-3.3C32.7,8,34,8.8,35.1,9.9C34.3,10.3,33.4,10.6,32.5,10.9z M23.5,10.8c-0.9-0.3-1.7-0.6-2.5-1 c1.1-1,2.4-1.8,3.8-2.3C24.3,8.4,23.8,9.6,23.5,10.8z M22.7,18.3c0,1.4,0.2,2.8,0.4,4.1c-1.3,0.3-2.3,0.7-3.2,1.3 c-1.2-1.5-2-3.3-2.1-5.3H22.7z"
				fill={color}
			/>
			<Path
				d="M52.2,35.3c-1-1-2.8-0.9-4.1-0.6c-0.4,0.1-0.7,0.2-1.1,0.4l-9.2,4.4c-0.3,0.2-0.7,0.3-1.1,0.3h-1.9 c0.4-0.9,0.3-1.8-0.2-2.8c-0.8-1.4-2.3-2.2-4-2.2h-9.8c-0.6,0-1.2,0.1-1.8,0.3l-6.9,2.7C11.8,37,11,36.3,10,36.3H5.2 c-1.2,0-2.2,1-2.2,2.2v10.2C3,50,4,51,5.2,51H10c0.9,0,1.6-0.5,2-1.2l10.3,0c0.3,0,0.5,0,0.8-0.1l15.3-2.7c0.5-0.1,0.9-0.2,1.3-0.4 l10.9-5.7c1.3-0.7,2.2-1.9,2.4-3.2C53.1,36.4,52.7,35.7,52.2,35.3z M10,49H5.2C5.1,49,5,48.9,5,48.8V38.6c0-0.1,0.1-0.2,0.2-0.2H10 c0.1,0,0.2,0.1,0.2,0.2v0.7c0,0,0,0,0,0v9.5C10.2,48.9,10.1,49,10,49z M51,37.3c-0.1,0.7-0.6,1.3-1.3,1.7l-10.9,5.7 c-0.2,0.1-0.5,0.2-0.7,0.2l-15.3,2.7c-0.1,0-0.3,0-0.4,0l-10.1,0V40l7.5-3c0.3-0.1,0.7-0.2,1-0.2h9.8c1,0,1.9,0.5,2.3,1.2 c0.3,0.5,0.3,0.9-0.2,1.3c-0.4,0.5-1.1,0.8-1.9,0.8h-9.4c-0.6,0-1,0.4-1,1s0.4,1,1,1h9.4c0.6,0,1.2-0.1,1.7-0.3h4.2 c0.7,0,1.4-0.2,2-0.4l9.2-4.4c0.2-0.1,0.4-0.2,0.6-0.2c1.3-0.3,2.1-0.1,2.4,0.1C51,36.8,51,37,51,37.3z"
				fill={color}
			/>
		</G>
	</Svg>
)

const EconomyIcon = ({ color = "#000000", size = 24 }) => (
	<Svg width={size} height={size} viewBox="0 0 64 64">
		<G>
			<Circle cx="9.0992" cy="17.5232" r="1.0691" fill={color} />
			<Path
				d="M19.9761,30H18A13,13,0,0,0,5,43v2a12.9906,12.9906,0,0,0,7,11.5256V61h6l1-2c.4241.0383,21,0,21,0l1,2h5V57c4.4894-1.7581,8.1065-5.1434,9-10l4-2V38H54a14.196,14.196,0,0,0-6-6.3035V25a8.687,8.687,0,0,0-8,5H36.0509"
				fill="none"
				stroke={color}
				strokeWidth="2"
			/>
			<Circle cx="46.5" cy="37.5" r="1.5" fill={color} />
			<Line
				x1="16"
				x2="40"
				y1="34"
				y2="34"
				stroke="#a9ba5a"
				strokeWidth="2"
			/>
			<Circle
				cx="27.9999"
				cy="24"
				r="10"
				fill="none"
				stroke={color}
				strokeWidth="2"
			/>
			<Line
				x1="32"
				x2="24"
				y1="19"
				y2="29"
				stroke={color}
				strokeWidth="2"
			/>
			<Circle
				cx="24.5"
				cy="20.5"
				r="1.5"
				fill="none"
				stroke={color}
				strokeWidth="2"
			/>
			<Circle
				cx="31.5"
				cy="27.5"
				r="1.5"
				fill="none"
				stroke={color}
				strokeWidth="2"
			/>
			<Circle
				cx="43"
				cy="12"
				r="2"
				fill="none"
				stroke={color}
				strokeWidth="2"
			/>
			<Path
				d="M29.25,54.0671l4.9163-3.9331a2.0742,2.0742,0,0,0,.5845-2.598,2.001,2.001,0,0,0-3-.5919l-1.75,1.4V40.5056a2,2,0,0,0-2-2h0a2,2,0,0,0-2,2v7.8389l-1.6462-1.317a2.1129,2.1129,0,0,0-2.9407.2609,2,2,0,0,0,.3374,2.7787l5,4A2,2,0,0,0,29.25,54.0671Z"
				fill="none"
				stroke={color}
				strokeWidth="2"
			/>
			<Line
				x1="49.5509"
				x2="52.5509"
				y1="17.0547"
				y2="20.0547"
				stroke={color}
				strokeWidth="2"
			/>
			<Line
				x1="52.5509"
				x2="49.5509"
				y1="17.0547"
				y2="20.0547"
				stroke={color}
				strokeWidth="2"
			/>
		</G>
	</Svg>
)

export default function DashboardGrid({ navigation }) {
	const colors = useTheme()
	const styles = getStyles(colors)
	const navigation = useNavigation()

	const cards = [
		{
			key: "scan",
			title: "Scan de la peau",
			icon: {
				name: "face-recognition",
				provider: "MaterialCommunityIcons",
			},
			badgeColor: colors.primarySoft,
			iconColor: colors.primary,
			onPress: () => navigation.navigate('CameraCapture'),
		},
		{
			key: "recommendations",
			title: "Conseils soins",
			icon: {
				name: "lightbulb-on-outline",
				provider: "MaterialCommunityIcons",
			},
			badgeColor: colors.surfaceAlt,
			iconColor: colors.accent,
		},
		{
			key: "products",
			title: "Produits Vaseline",
			icon: { name: "shopping-bag", provider: "Feather" },
			badgeColor: colors.surfaceAlt,
			iconColor: colors.primaryDark,
			onPress: () => navigation?.navigate("Products"),
		},
		{
			key: "savings",
			title: "Économies réalisées",
			valueColor: colors.success,
			icon: { type: "custom", component: EconomyIcon },
			badgeColor: colors.primarySoft,
			iconColor: colors.success,
		},
		{
			key: "carbon",
			title: "Empreinte carbone",
			valueColor: colors.info,
			icon: { type: "custom", component: EcologyIcon },
			badgeColor: colors.surfaceAlt,
			iconColor: colors.info,
		},
		{
			key: "plastic",
			title: "Plastique évité",
			valueSuffix: "bouteilles",
			valueColor: colors.warning,
			icon: { name: "recycle", provider: "MaterialCommunityIcons" },
			badgeColor: colors.primarySoft,
			iconColor: colors.warning,
		},
	]

	return (
		<View style={styles.container}>
			<View style={styles.grid}>
				{cards.map(
					(
						{
							key,
							title,
							description,
							value,
							valueColor,
							valueSuffix,
							icon,
							badgeColor,
							iconColor,
							onPress,
						},
						index,
					) => {
						const CardComponent = onPress ? TouchableOpacity : View
						const interactiveProps = onPress
							? { activeOpacity: 0.85, onPress, accessibilityRole: 'button', accessibilityLabel: title }
							: {}

						const isSpecialCard = index % 2 === 0
						const cardStyle = isSpecialCard
							? [styles.gridItem, styles.specialGridItem]
							: styles.gridItem

						// Use dedicated component for the Scan tile to match develop organization
						if (key === 'scan') {
							return <ScanSkinCard key={key} style={cardStyle} />
						}

						return (
							<CardComponent
								key={key}
								style={cardStyle}
								{...interactiveProps}
							>
								{isSpecialCard ? (
									<LinearGradient
										colors={["#212F59", "#212F59"]}
										style={styles.gradientContainer}
									>
										<View
											style={[
												styles.iconBadge,
												{
													backgroundColor:
														"rgba(255,255,255,0.2)",
												},
											]}
										>
											{icon.type === "custom" ? (
												<icon.component
													color="white"
													size={22}
												/>
											) : (
												<AppIcon
													name={icon.name}
													provider={icon.provider}
													color="white"
													size={22}
												/>
											)}
										</View>
										<Text
											style={[
												styles.cardTitle,
												{ color: "white" },
											]}
										>
											{title}
										</Text>
										{value ? (
											<Text
												style={[
													styles.cardValue,
												{ color: "white" },
											]}
											>
												{value}
												{valueSuffix
													? ` ${valueSuffix}`
													: ""}
											</Text>
										) : null}
									</LinearGradient>
								) : (
									<>
										<View
											style={[
												styles.iconBadge,
												{
													backgroundColor:
														"rgba(59, 130, 246, 0.1)",
												},
											]}
										>
											{icon.type === "custom" ? (
												<icon.component
													color={iconColor}
													size={24}
												/>
											) : (
												<AppIcon
													name={icon.name}
													provider={icon.provider}
													color={iconColor}
													size={24}
												/>
											)}
										</View>
										<Text
											style={[
												styles.cardTitle,
												{ color: colors.textPrimary },
											]}
										>
											{title}
										</Text>
										{value ? (
											<Text
												style={[
													styles.cardValue,
												{
														color:
															valueColor ||
															colors.textPrimary,
												},
											]}
											>
												{value}
												{valueSuffix
														? ` ${valueSuffix}`
														: ""}
											</Text>
										) : null}
									</>
								)}
							</CardComponent>
						)
					},
				)}
			</View>
		</View>
	)
}

const getStyles = (colors) => {
	return StyleSheet.create({
		container: {
			paddingHorizontal: spacing.xl,
			position: "fixed",
			bottom: -6,
			left: 0,
			right: 0,
			zIndex: 1000,
			padding: spacing.md,
		},
		grid: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-between",
			gap: 10,
			marginTop: 20,
		},
		gridItem: {
			flexBasis: "32%",
			maxWidth: "31.5%",
			maxHeight: 120,
			borderRadius: radius.md,
			overflow: "hidden",
			padding: spacing.md,
			alignItems: "flex-start",
			gap: spacing.xs,
			marginBottom: spacing.xs,
			borderColor: colors.border,
			backgroundColor: "#ffffff",
		},
		specialGridItem: {
			backgroundColor: "transparent",
			padding: 0,
		},
		gradientContainer: {
			flex: 1,
			padding: spacing.md,
			alignItems: "flex-start",
			gap: spacing.xs,
			borderRadius: radius.md,
		},
		iconBadge: {
			alignSelf: "flex-start",
			borderRadius: radius.full,
			padding: spacing.sm,
			marginBottom: spacing.sm,
		},
		cardTitle: {
			fontSize: 16,
			fontWeight: "600",
			marginBottom: spacing.xs,
		},
		cardValue: {
			fontSize: 20,
			fontWeight: "700",
			marginBottom: spacing.xs,
		},
		cardDescription: {
			fontSize: 13,
			lineHeight: 18,
			flexShrink: 1,
		},
	})
}
