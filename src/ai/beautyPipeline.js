import * as tf from '@tensorflow/tfjs';
import base64js from 'base64-js';
import { estimateBlurScore128, estimateExposureFromV } from './imageQuality';
import { computeITAfromRGBRegion, mstFromITA } from './skinTone';
import { hairVolumeRatio, hairShineProxyHSV, hairFrizzProxyGLCM } from './featuresHair';
import { classifyHairType } from './hairTypeClassifier';
import { classifyHairTypeTFLiteIfAvailable } from './hairTFLite';
import { fetchEnvSignals } from '../env/openMeteo';
import { defaultBeautyProfile } from '../types/beauty';
import { Platform } from 'react-native';
import { getFaceRoiWeb, getSegmentationMasksWeb, getFaceRoiNative, getSegmentationMasksNative } from './visionIntegrations';

// Simplified segmenter placeholder (hair/skin) with TFJS ops only.
// Phase 2: replace with MediaPipe Tasks outputs masks.
function simpleSkinHairMask(u8rgb, width, height){
  const n = width*height;
  const maskHair = new Uint8Array(n);
  const maskSkin = new Uint8Array(n);
  for (let i=0;i<n;i++){
    const r = u8rgb[i*3+0];
    const g = u8rgb[i*3+1];
    const b = u8rgb[i*3+2];
    const maxc = Math.max(r,g,b), minc = Math.min(r,g,b);
    const s = maxc === 0 ? 0 : (maxc-minc)/maxc;
    // Heuristique hair sombre/faible saturation
    if (maxc < 90 && s < 0.4) maskHair[i] = 1;
    // Heuristique peau (r>g>b et saturation modérée)
    if (r > 95 && g > 40 && b > 20 && (r - Math.max(g,b)) > 15 && s < 0.68) maskSkin[i] = 1;
  }
  return { maskHair, maskSkin };
}

export async function analyzeBeauty({ base64, location }){
  const profile = defaultBeautyProfile();
  profile.timestamp = new Date().toISOString();

  // Décodage base64 -> octets
  let bin;
  try {
    bin = base64js.toByteArray(base64);
  } catch {
    bin = new Uint8Array();
  }

  // Approximated downsample to 128x128 RGB float [0..1]
  const width = 128, height = 128;
  let data128 = new Float32Array(width*height*3);
  if (bin.length >= 3){
    const totalPixelsApprox = Math.floor(bin.length/3);
    const step = Math.max(1, Math.floor(totalPixelsApprox / (width*height)));
    for (let i=0, j=0; i<width*height*3 && (j+2)<bin.length; i+=3, j+=step*3){
      data128[i]   = bin[j]   / 255;
      data128[i+1] = bin[j+1] / 255;
      data128[i+2] = bin[j+2] / 255;
    }
  } else {
    data128.fill(0.5);
  }

  // Essayer d’obtenir landmarks/ROI + masques via MediaPipe (web) ou natif
  let roi = null, hairMask = null, skinMask = null;
  try {
    if (Platform.OS === 'web'){
      // Créer un ImageBitmap depuis base64 pour Tasks
      const blob = new Blob([bin], { type: 'image/jpeg' });
      const imgBitmap = await createImageBitmap(blob);
      roi = await getFaceRoiWeb(imgBitmap);
      const m = await getSegmentationMasksWeb(imgBitmap, width, height);
      hairMask = m.hairMask; skinMask = m.skinMask;
    } else {
      roi = await getFaceRoiNative(base64);
      const m = await getSegmentationMasksNative(base64, width, height);
      hairMask = m.hairMask; skinMask = m.skinMask;
    }
  } catch {}

  // Construire u8rgb
  const u8rgb = new Uint8Array(width*height*3);
  for (let i=0;i<u8rgb.length;i++) u8rgb[i] = Math.round((data128?.[i] ?? 0.5)*255);

  // Fallback heuristique des masques si non dispo
  if (!hairMask || !skinMask){
    const m = simpleSkinHairMask(u8rgb, width, height);
    hairMask = hairMask || m.maskHair; skinMask = skinMask || m.maskSkin;
  }

  // Features
  const blur = estimateBlurScore128(data128, width, height);
  const exposure = estimateExposureFromV(data128, width, height);
  const shine = hairShineProxyHSV(data128, hairMask || new Uint8Array(width*height));
  const gray = new Float32Array(width*height);
  for (let i=0;i<width*height;i++){ gray[i] = (data128[i*3]+data128[i*3+1]+data128[i*3+2])/3; }
  const frizz = hairFrizzProxyGLCM(gray, hairMask || new Uint8Array(width*height), width, height);
  const vol = hairVolumeRatio(hairMask || new Uint8Array(width*height));

  // Cheveux: essayer TFLite (web) puis heuristique
  let hairType = await classifyHairTypeTFLiteIfAvailable(data128, hairMask);
  if (!hairType) hairType = classifyHairType({ frizz_proxy: frizz, curlinessProxy: frizz*0.8 + (1-shine)*0.2 });

  // ITA/MST avec calibration simple: si ROI dispo, renforcer pondération sur centre du ROI
  let ita;
  if (roi){
    const maskFaceWeighted = new Uint8Array(width*height);
    // Pondérer la zone centrale du visage (éviter bord/cheveux)
    const cx0 = Math.floor(width*0.2), cx1 = Math.ceil(width*0.8);
    const cy0 = Math.floor(height*0.25), cy1 = Math.ceil(height*0.85);
    for (let y=0;y<height;y++){
      for (let x=0;x<width;x++){
        const i = y*width + x;
        const inCore = (x>=cx0 && x<=cx1 && y>=cy0 && y<=cy1);
        maskFaceWeighted[i] = inCore ? (skinMask?.[i] ? 1 : 0) : 0;
      }
    }
    ita = computeITAfromRGBRegion(u8rgb, maskFaceWeighted);
  } else {
    ita = computeITAfromRGBRegion(u8rgb, skinMask || new Uint8Array(width*height));
  }
  const mst = mstFromITA(ita);

  profile.hair_type = hairType.label;
  profile.hair_features = { volume: vol, frizz_proxy: frizz, shine_proxy: shine };
  profile.skin_tone = { mst_bin: mst, ita_value: ita };
  profile.skin_regions_confidence = { face_conf: roi ? 0.85 : 0.6 };
  profile.image_quality = { blur_score: blur, exposure };

  // Env via Open-Meteo si position fournie
  if (location?.latitude && location?.longitude){
    profile.env = await fetchEnvSignals(location);
  }

  return profile;
}
