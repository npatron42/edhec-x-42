import React, { useEffect, useMemo, useState } from "react"
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	ScrollView,
	Alert,
	Platform,
	TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import {
	getUserProfile,
	updateUserProfile,
	signOutUser,
	clearAllData,
	redeemDiscount,
} from "../utils/storage"
import { spacing, radius, shadow, typography } from "../styles/theme"
import { AppButton, AppIcon } from "../components/common"
import { useTheme } from "../styles/ThemeProvider"
import Header from "./Header"

import AntDesign from "@expo/vector-icons/AntDesign"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

export default function ProfileScreen({ navigation }) {
	const [profile, setProfile] = useState(null)
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [saving, setSaving] = useState(false)

	const { mode, setMode, colors: themeColors } = useTheme()
	const styles = useMemo(() => getStyles(themeColors), [themeColors])

	useEffect(() => {
		let isMounted = true
		;(async () => {
			const data = await getUserProfile()
			if (isMounted) {
				setProfile(data)
				setName(data?.name || "")
				setEmail(data?.email || "")
			}
		})()
		return () => {
			isMounted = false
		}
	}, [])

	const handleSave = async () => {
		if (!name.trim() || !email.trim()) {
			return
		}
		setSaving(true)
		const updated = await updateUserProfile({
			name: name.trim(),
			email: email.trim().toLowerCase(),
		})
		setProfile(updated)
		setSaving(false)
	}

	const handleSignOut = async () => {
		await signOutUser()
		navigation.reset({ index: 0, routes: [{ name: "Auth" }] })
	}

	const handleClearAll = () => {
		Alert.alert("Réinitialiser", "Supprimer toutes vos données locales ?", [
			{ text: "Annuler", style: "cancel" },
			{
				text: "Supprimer",
				style: "destructive",
				onPress: async () => {
					await clearAllData()
					navigation.reset({ index: 0, routes: [{ name: "Auth" }] })
				},
			},
		])
	}

	const handleRedeem = async (id) => {
		const ok = await redeemDiscount(id)
		if (ok) {
			const updated = await getUserProfile()
			setProfile(updated)
		}
	}

	const availableDiscounts = (profile?.rewards?.discounts || []).filter(
		(discount) => !discount.used,
	)

	const ThemeOption = ({ value, label, icon }) => {
		const isSelected = mode === value
		return (
			<TouchableOpacity
				onPress={() => setMode(value)}
				style={[
					styles.themeOption,
					{
						borderColor: isSelected
							? themeColors.primary
							: themeColors.border,
						backgroundColor: isSelected
							? themeColors.primarySoft
							: themeColors.surface,
					},
				]}
				accessibilityRole="button"
				accessibilityLabel={`Thème ${label}`}
			>
				<AppIcon
					name={icon.name}
					provider={icon.provider}
					size={18}
					color={
						isSelected
							? themeColors.primary
							: themeColors.textSecondary
					}
				/>
				<Text
					style={[
						styles.themeOptionLabel,
						{
							color: isSelected
								? themeColors.textPrimary
								: themeColors.textSecondary,
						},
					]}
				>
					{label}
				</Text>
				{isSelected ? (
					<AppIcon
						name="check"
						provider="Feather"
						size={16}
						color={themeColors.primary}
					/>
				) : null}
			</TouchableOpacity>
		)
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<Header
				headerTitle="Mon Profil"
				headerSubtitle="Gérez vos informations et récompenses"
				navigation={navigation}
			/>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<FontAwesome5
							name="award"
							size={22}
							color={themeColors.primary}
						/>
						<Text style={styles.sectionTitle}>Récompenses</Text>
					</View>
					<View style={styles.pointsRow}>
						<AppIcon
							name="star-circle"
							provider="MaterialCommunityIcons"
							size={24}
							color={themeColors.primary}
						/>
						<Text style={styles.pointsText}>
							Points : {profile?.rewards?.points || 0}
						</Text>
					</View>
					<View style={styles.badges}>
						{(profile?.rewards?.badges || []).length === 0 ? (
							<Text style={styles.emptyText}>
								Aucun badge débloqué pour le moment
							</Text>
						) : (
							profile.rewards.badges.map((badge, index) => (
								<View
									key={`profile-badge-${badge.id || index}`}
									style={styles.badge}
								>
									<Text style={styles.badgeEmoji}>
										{badge.icon || "⭐"}
									</Text>
									<Text style={styles.badgeLabel}>
										{badge.name}
									</Text>
								</View>
							))
						)}
					</View>
					{availableDiscounts.length ? (
						<View style={styles.discounts}>
							<Text style={styles.sectionSubtitle}>
								Réductions disponibles
							</Text>
							{availableDiscounts.map((discount, index) => (
								<View
									key={`profile-discount-${
										discount.id || index
									}`}
									style={styles.discount}
								>
									<View style={styles.discountInfo}>
										<Text style={styles.discountLabel}>
											{discount.label ||
												"-5% sur produit"}
										</Text>
										<Text style={styles.discountCode}>
											{discount.code ||
												"Utilisation en borne"}
										</Text>
									</View>
									<AppButton
										label="Utiliser"
										icon={{
											name: "ticket-confirmation",
											provider: "MaterialCommunityIcons",
										}}
										onPress={() =>
											handleRedeem(discount.id)
										}
										style={styles.discountButton}
									/>
								</View>
							))}
						</View>
					) : null}
				</View>
				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<MaterialIcons
							name="palette"
							size={24}
							color={themeColors.primary}
						/>
						<Text style={styles.sectionTitle}>Apparence</Text>
					</View>
					<Text style={styles.sectionSubtitle}>
						Choisissez votre thème
					</Text>
					<View style={styles.themeRow}>
						<ThemeOption
							value="light"
							label="Clair"
							icon={{
								name: "sunny-outline",
								provider: "Ionicons",
							}}
						/>
						<ThemeOption
							value="dark"
							label="Sombre"
							icon={{
								name: "moon-outline",
								provider: "Ionicons",
							}}
						/>
					</View>
				</View>

				<View style={styles.card}>
					<View style={styles.sectionHeader}>
						<AntDesign
							name="user"
							size={24}
							color={themeColors.primary}
						/>
						<Text style={styles.sectionTitle}>Informations</Text>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Nom</Text>
						<TextInput
							value={name}
							onChangeText={setName}
							placeholder="Votre nom"
							style={styles.input}
							placeholderTextColor={themeColors.textMuted}
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							value={email}
							onChangeText={setEmail}
							placeholder="vous@exemple.com"
							autoCapitalize="none"
							keyboardType="email-address"
							style={styles.input}
							placeholderTextColor={themeColors.textMuted}
						/>
					</View>
					<AppButton
						label={saving ? "Enregistrement…" : "Enregistrer"}
						icon={{ name: "save-outline", provider: "Ionicons" }}
						onPress={handleSave}
						disabled={saving}
					/>
				</View>
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Session</Text>
					<AppButton
						label="Se déconnecter"
						variant="outline"
						icon={{ name: "log-out-outline", provider: "Ionicons" }}
						onPress={handleSignOut}
						style={styles.sessionButton}
					/>
					<AppButton
						label="Supprimer mes données"
						icon={{ name: "trash-outline", provider: "Ionicons" }}
						onPress={handleClearAll}
						style={[
							styles.dangerButton,
							{
								backgroundColor: themeColors.danger,
								borderColor: themeColors.danger,
							},
						]}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const getStyles = (c) =>
	StyleSheet.create({
		safeArea: {
			flex: 1,
			backgroundColor: c.background,
		},
		scroll: {
			flex: 1,
			backgroundColor: c.background,
			...Platform.select({
				web: {
					height: "100vh",
					overflow: "auto",
				},
			}),
		},
		content: {
			flexGrow: 1,
			paddingTop: 180,
			paddingHorizontal: spacing.xl,
			paddingBottom: spacing.xxxl,
			gap: spacing.xl,
			...Platform.select({
				web: { minHeight: "100vh" },
			}),
		},
		card: {
			borderRadius: radius.xl,
			padding: spacing.xl,
			borderWidth: 1,
			borderColor: c.border,
			backgroundColor: c.surface,
			gap: spacing.md,
			...shadow.soft,
		},
		sectionHeader: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.sm,
		},
		sectionTitle: {
			...typography.h3,
			color: c.textPrimary,
		},
		sectionSubtitle: {
			...typography.bodySmall,
			color: c.textMuted,
		},
		formGroup: {
			gap: spacing.sm,
		},
		label: {
			...typography.label,
			color: c.primary,
		},
		input: {
			borderWidth: 1,
			borderRadius: radius.lg,
			padding: spacing.lg,
			backgroundColor: c.surface,
			color: c.textPrimary,
			borderColor: c.surfaceAlt,
		},
		themeRow: {
			flexDirection: "row",
			gap: spacing.sm,
		},
		themeOption: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			borderWidth: 1,
			borderRadius: radius.lg,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.lg,
			gap: spacing.sm,
		},
		themeOptionLabel: {
			...typography.label,
			flex: 1,
		},
		pointsRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: spacing.sm,
		},
		pointsText: {
			...typography.body,
			color: c.textPrimary,
			fontWeight: "600",
		},
		badges: {
			flexDirection: "row",
			flexWrap: "wrap",
			marginHorizontal: -spacing.sm,
			gap: spacing.sm,
		},
		badge: {
			alignItems: "center",
			borderRadius: radius.md,
			paddingVertical: spacing.md,
			paddingHorizontal: spacing.md,
			marginHorizontal: spacing.sm,
			minWidth: 100,
			backgroundColor: c.surface,
			...shadow.soft,
		},
		badgeEmoji: {
			fontSize: 30,
			marginBottom: spacing.xs,
		},
		badgeLabel: {
			...typography.bodySmall,
			color: c.textSecondary,
			textAlign: "center",
			fontWeight: "600",
		},
		emptyText: {
			...typography.bodySmall,
			color: c.textMuted,
		},
		discounts: {
			gap: spacing.sm,
		},
		discount: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			borderWidth: 1,
			borderRadius: radius.lg,
			padding: spacing.lg,
			gap: spacing.lg,
			borderColor: c.border,
			backgroundColor: c.surface,
			...shadow.soft,
		},
		discountInfo: {
			flex: 1,
			gap: spacing.xs,
		},
		discountLabel: {
			...typography.body,
			color: c.textPrimary,
			fontWeight: "600",
		},
		discountCode: {
			...typography.bodySmall,
			color: c.textMuted,
		},
		discountButton: {
			flexBasis: 140,
		},
		sessionButton: {
			marginBottom: spacing.sm,
		},
		dangerButton: {
			backgroundColor: c.danger,
			borderColor: c.danger,
		},
	})
