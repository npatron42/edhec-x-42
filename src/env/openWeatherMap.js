import { getOpenWeatherMapKey } from "./config.js"

export async function fetchWeatherData({ latitude, longitude } = {}) {
	const defaults = {
		weather: null,
		airPollution: null,
		error: "Invalid coordinates",
	}

	try {
		const latOk = typeof latitude === "number" && isFinite(latitude)
		const lonOk = typeof longitude === "number" && isFinite(longitude)

		if (!latOk || !lonOk) {
			console.warn("[WEATHER] Invalid coordinates, using defaults", {
				latitude,
				longitude,
			})
			return defaults
		}

		const apiKey = getOpenWeatherMapKey()
		if (!apiKey) {
			console.warn("[WEATHER] Missing API key")
			return { ...defaults, error: "Missing API key" }
		}

		const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
		const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

		const safeFetchJson = async (url, label) => {
			try {
				const res = await fetch(url)
				if (!res.ok) {
					const body = await res.text().catch(() => "")
					console.warn(
						`[WEATHER] ${label} HTTP ${res.status}`,
						body.slice(0, 200),
					)
					return null
				}
				return await res.json()
			} catch (e) {
				console.warn(`[WEATHER] ${label} fetch error`, e?.message)
				return null
			}
		}

		const [weatherData, airPollutionData] = await Promise.all([
			safeFetchJson(weatherUrl, "OpenWeatherMap Weather"),
			safeFetchJson(airPollutionUrl, "OpenWeatherMap Air Pollution"),
		])

		const result = {
			weather: weatherData,
			airPollution: airPollutionData,
			timestamp: new Date().toISOString(),
			coordinates: { latitude, longitude },
		}

		console.log("[WEATHER] Weather data fetched successfully", {
			hasWeather: !!weatherData,
			hasAirPollution: !!airPollutionData,
		})

		return result
	} catch (e) {
		console.warn("[WEATHER] Failed to fetch weather data", e?.message)
		return { ...defaults, error: e?.message || "Unknown error" }
	}
}
