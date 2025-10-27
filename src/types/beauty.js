// Types JSDoc pour décrire le profil beauté et les recommandations

/**
 * @typedef {Object} HairFeatures
 * @property {number} volume Ratio 0..1
 * @property {number} frizz_proxy 0..1 (plus élevé = plus de frisottis/texture)
 * @property {number} shine_proxy 0..1 (plus élevé = plus brillant)
 */

/**
 * @typedef {Object} SkinTone
 * @property {number} mst_bin 0..9 (Monk Skin Tone)
 * @property {number} ita_value ITA en degrés
 */

/**
 * @typedef {Object} ImageQuality
 * @property {number} blur_score 0..1 (plus haut = plus net)
 * @property {number} exposure 0..1 (approx)
 */

/**
 * @typedef {Object} EnvSignals
 * @property {number} uv_index
 * @property {number} humidity Pourcentage
 * @property {number} wind Vitesse m/s
 * @property {number} pm2_5 µg/m³
 * @property {number} pm10 µg/m³
 * @property {number} ozone µg/m³
 */

/**
 * @typedef {Object} BeautyProfile
 * @property {('Straight'|'Wavy'|'Curly'|'Kinky')} hair_type
 * @property {HairFeatures} hair_features
 * @property {SkinTone} skin_tone
 * @property {{ face_conf: number, body_conf?: number }} skin_regions_confidence
 * @property {ImageQuality} image_quality
 * @property {EnvSignals} env
 * @property {string} timestamp ISO string
 * @property {{ platform: string, model?: string }} device_info
 */

export const MST_CATEGORIES = [0,1,2,3,4,5,6,7,8,9];

export const defaultBeautyProfile = () => ({
  hair_type: 'Straight',
  hair_features: { volume: 0.3, frizz_proxy: 0.2, shine_proxy: 0.5 },
  skin_tone: { mst_bin: 4, ita_value: 0 },
  skin_regions_confidence: { face_conf: 0.5 },
  image_quality: { blur_score: 0.5, exposure: 0.5 },
  env: { uv_index: 4, humidity: 50, wind: 3, pm2_5: 8, pm10: 12, ozone: 80 },
  timestamp: new Date().toISOString(),
  device_info: { platform: 'unknown' },
});
