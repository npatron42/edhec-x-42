// Adapter: normalise les signaux environnementaux attendus par l’UI
// en s’appuyant sur OpenWeatherMap.

import { fetchWeatherData } from "./openWeatherMap";

// Signature: fetchEnvSignals({ latitude, longitude })
// Retourne: { uv_index, humidity, pm2_5, temp_c, wind_ms }
export async function fetchEnvSignals({ latitude, longitude } = {}) {
  try {
    const { weather, airPollution } = await fetchWeatherData({ latitude, longitude });

    // OpenWeatherMap courant ne donne pas toujours l’UV index (OneCall requis) → fallback
    const uvRaw = weather?.uvi ?? weather?.uv_index;
    const humidityRaw = weather?.main?.humidity ?? weather?.humidity;
    const pm25Raw = airPollution?.list?.[0]?.components?.pm2_5;
    const tempC = weather?.main?.temp ?? null;
    const windMs = weather?.wind?.speed ?? null;

    return {
      uv_index: typeof uvRaw === "number" ? uvRaw : 4,
      humidity: typeof humidityRaw === "number" ? humidityRaw : 50,
      pm2_5: typeof pm25Raw === "number" ? pm25Raw : 8,
      temp_c: typeof tempC === "number" ? tempC : null,
      wind_ms: typeof windMs === "number" ? windMs : null,
    };
  } catch (e) {
    console.warn("[ENV] fetchEnvSignals failed", e?.message);
    return { uv_index: 4, humidity: 50, pm2_5: 8, temp_c: null, wind_ms: null };
  }
}
