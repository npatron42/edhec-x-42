import Constants from "expo-constants"

export function getOpenAIKey() {
	const extra =
		Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}
	return extra.OPENAI_API_KEY || process.env.OPENAI_API_KEY || ""
}

export function getGeminiKey() {
	const extra =
		Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}
	return extra.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""
}

export function getOpenWeatherMapKey() {
	const extra =
		Constants?.expoConfig?.extra || Constants?.manifest?.extra || {}
	return (
		extra.OPENWEATHERMAP_API_KEY ||
		process.env.OPENWEATHERMAP_API_KEY ||
		"303cef7e752857b115fc6e37a99c0b6b"
	)
}
