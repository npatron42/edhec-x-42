export async function fetchEnvSignals({ latitude, longitude } = {}){
  const defaults = { uv_index: 4, humidity: 50, wind: 3, pm2_5: 8, pm10: 12, ozone: 80 };
  try {
    const latOk = typeof latitude === 'number' && isFinite(latitude);
    const lonOk = typeof longitude === 'number' && isFinite(longitude);
    if (!latOk || !lonOk) {
      console.warn('[ENV] Coordonnées invalides, utilisation des valeurs par défaut', { latitude, longitude });
      return defaults;
    }

    // Build URLs for forecast (weather) and air quality. Use the supported endpoints and variable names.
    const qs = (params) => new URLSearchParams(params).toString();

    // New variable names (preferred)
    const forecastParams = {
      latitude: String(latitude),
      longitude: String(longitude),
      hourly: 'uv_index,relative_humidity_2m,wind_speed_10m',
      timezone: 'auto',
    };

    const airParams = {
      latitude: String(latitude),
      longitude: String(longitude),
      hourly: 'pm10,pm2_5,ozone',
      timezone: 'auto',
    };

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?${qs(forecastParams)}`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${qs(airParams)}`;

    // Helper to safely fetch JSON
    const safeFetchJson = async (url, label) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          console.warn(`[ENV] ${label} HTTP ${res.status}`, body.slice(0, 200));
          return null;
        }
        return await res.json();
      } catch (e) {
        console.warn(`[ENV] ${label} fetch erreur`, e?.message);
        return null;
      }
    };

    // Run both requests in parallel
    const [forecastJson, airJson] = await Promise.all([
      safeFetchJson(forecastUrl, 'Open-Meteo Forecast'),
      safeFetchJson(airUrl, 'Open-Meteo AirQuality'),
    ]);

    // If forecast with new names failed, try legacy variable names as fallback (to handle older deployments)
    let hForecast = forecastJson?.hourly;
    if (!hForecast) {
      const legacyForecastUrl = `https://api.open-meteo.com/v1/forecast?${qs({
        latitude: String(latitude),
        longitude: String(longitude),
        hourly: 'uv_index,relativehumidity_2m,windspeed_10m',
        timezone: 'auto',
      })}`;
      const legacy = await safeFetchJson(legacyForecastUrl, 'Open-Meteo Forecast (legacy)');
      hForecast = legacy?.hourly;
    }

    const hAir = airJson?.hourly;

    // Pick first available datapoint from arrays
    const pick = (obj, key) => {
      const arr = obj && Array.isArray(obj[key]) ? obj[key] : null;
      return arr && arr.length ? arr[0] : undefined;
    };

    const uv_index = pick(hForecast, 'uv_index');
    const humidity = pick(hForecast, 'relative_humidity_2m') ?? pick(hForecast, 'relativehumidity_2m');
    const wind = pick(hForecast, 'wind_speed_10m') ?? pick(hForecast, 'windspeed_10m');
    const pm2_5 = pick(hAir, 'pm2_5');
    const pm10 = pick(hAir, 'pm10');
    const ozone = pick(hAir, 'ozone');

    const result = {
      uv_index: uv_index ?? defaults.uv_index,
      humidity: humidity ?? defaults.humidity,
      wind: wind ?? defaults.wind,
      pm2_5: pm2_5 ?? defaults.pm2_5,
      pm10: pm10 ?? defaults.pm10,
      ozone: ozone ?? defaults.ozone,
    };

    // Log a brief summary for debugging
    try {
      console.log('[ENV] Signaux environnementaux', {
        src: {
          forecast: !!hForecast,
          air: !!hAir,
        },
        ...result,
      });
    } catch {}

    return result;
  } catch (e) {
    console.warn('[ENV] Échec récupération Open-Meteo, fallback valeurs par défaut', e?.message);
    return defaults;
  }
}
