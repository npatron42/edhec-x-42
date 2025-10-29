import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	ScrollView,
	Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AppIcon from "./AppIcon"
import { spacing, radius, shadow, typography } from "../../styles/theme"
import { useTheme } from "../../styles/ThemeProvider"

const parseMarkdown = (markdown) => {
	const lines = markdown.split("\n")
	const elements = []
	let currentText = ""

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()

		if (line.startsWith("# ")) {
			if (currentText) {
				elements.push({ type: "text", content: currentText })
				currentText = ""
			}
			elements.push({ type: "h1", content: line.substring(2) })
		} else if (line.startsWith("## ")) {
			if (currentText) {
				elements.push({ type: "text", content: currentText })
				currentText = ""
			}
			elements.push({ type: "h2", content: line.substring(3) })
		} else if (line.startsWith("### ")) {
			if (currentText) {
				elements.push({ type: "text", content: currentText })
				currentText = ""
			}
			elements.push({ type: "h3", content: line.substring(4) })
		} else if (line.startsWith("- ")) {
			if (currentText) {
				elements.push({ type: "text", content: currentText })
				currentText = ""
			}
			elements.push({ type: "bullet", content: line.substring(2) })
		} else if (line === "") {
			if (currentText) {
				elements.push({ type: "text", content: currentText })
				currentText = ""
			}
		} else {
			currentText += (currentText ? "\n" : "") + line
		}
	}

	if (currentText) {
		elements.push({ type: "text", content: currentText })
	}

	return elements
}

export default function MarkdownModal({
	visible,
	onClose,
	markdownFile,
	markdownContent,
}) {
	const [content, setContent] = useState("")
	const [loading, setLoading] = useState(false)
	const { colors: themeColors } = useTheme()
	const styles = getStyles(themeColors)

	useEffect(() => {
		if (visible) {
			if (markdownContent) {
				setContent(markdownContent)
			} else if (markdownFile) {
				loadMarkdownContent()
			}
		}
	}, [visible, markdownFile, markdownContent])

	const loadMarkdownContent = async () => {
		setLoading(true)
		try {
			if (Platform.OS === "web") {
				const response = await fetch(markdownFile)
				const text = await response.text()
				setContent(text)
			} else {
				const { Asset } = require("expo-asset")
				const asset = Asset.fromModule(markdownFile)
				await asset.downloadAsync()
				const response = await fetch(asset.localUri || asset.uri)
				const text = await response.text()
				setContent(text)
			}
		} catch (error) {
			console.error(
				"Erreur lors du chargement du fichier markdown:",
				error,
			)
			setContent("Erreur lors du chargement du contenu.")
		}
		setLoading(false)
	}

	const renderElement = (element, index) => {
		switch (element.type) {
			case "h1":
				return (
					<Text key={index} style={styles.h1}>
						{element.content}
					</Text>
				)
			case "h2":
				return (
					<Text key={index} style={styles.h2}>
						{element.content}
					</Text>
				)
			case "h3":
				return (
					<Text key={index} style={styles.h3}>
						{element.content}
					</Text>
				)
			case "bullet":
				return (
					<View key={index} style={styles.bulletContainer}>
						<Text style={styles.bullet}>•</Text>
						<Text style={styles.bulletText}>{element.content}</Text>
					</View>
				)
			case "text":
				return (
					<Text key={index} style={styles.text}>
						{element.content}
					</Text>
				)
			default:
				return null
		}
	}

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={onClose}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						onPress={onClose}
						style={styles.closeButton}
					>
						<AppIcon
							name="x"
							provider="Feather"
							size={24}
							color={themeColors.textPrimary}
						/>
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}
				>
					{loading ? (
						<View style={styles.loadingContainer}>
							<AppIcon
								name="loader"
								provider="Feather"
								size={32}
								color={themeColors.primary}
							/>
							<Text style={styles.loadingText}>
								Chargement du contenu...
							</Text>
						</View>
					) : (
						parseMarkdown(content).map((element, index) =>
							renderElement(element, index),
						)
					)}
				</ScrollView>
			</SafeAreaView>
		</Modal>
	)
}

const getStyles = (colors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
		},
		header: {
			flexDirection: "row",
			justifyContent: "flex-end",
			alignItems: "center",
			paddingHorizontal: spacing.xl,
			paddingVertical: spacing.lg,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		closeButton: {
			width: 40,
			height: 40,
			borderRadius: radius.lg,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: colors.surface,
		},
		scroll: {
			flex: 1,
		},
		content: {
			padding: spacing.xl,
			paddingBottom: spacing.xxxl,
		},
		loadingContainer: {
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: spacing.xxxl,
			gap: spacing.md,
		},
		loadingText: {
			...typography.body,
			color: colors.textMuted,
		},
		h1: {
			...typography.h1,
			color: colors.textPrimary,
			marginBottom: spacing.lg,
			marginTop: spacing.xl,
		},
		h2: {
			...typography.h2,
			color: colors.textPrimary,
			marginBottom: spacing.md,
			marginTop: spacing.lg,
		},
		h3: {
			...typography.h3,
			color: colors.textPrimary,
			marginBottom: spacing.sm,
			marginTop: spacing.md,
		},
		text: {
			...typography.body,
			color: colors.textSecondary,
			lineHeight: 24,
			marginBottom: spacing.md,
		},
		bulletContainer: {
			flexDirection: "row",
			alignItems: "flex-start",
			marginBottom: spacing.sm,
			paddingLeft: spacing.md,
		},
		bullet: {
			...typography.body,
			color: colors.primary,
			marginRight: spacing.sm,
			fontWeight: "600",
		},
		bulletText: {
			...typography.body,
			color: colors.textSecondary,
			flex: 1,
			lineHeight: 22,
		},
	})
