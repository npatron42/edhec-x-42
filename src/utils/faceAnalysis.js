// Analyse on-device avec TFJS (étape 1->2): décodage base64, détection visage (web & RN) et métriques + heatmap
import * as tf from '@tensorflow/tfjs';
import { Platform } from 'react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import base64js from 'base64-js';

// IMPORTANT: ne chargez tfjs-react-native que sur mobile via import dynamique
let decodeJpegRN = null;
async function ensureNativeBindings() {
  if (Platform.OS === 'web') return;
  if (decodeJpegRN) return;
  // Active le runtime React Native pour TFJS
  await import('@tensorflow/tfjs-react-native/dist/platform_react_native');
  const rn = await import('@tensorflow/tfjs-react-native');
  decodeJpegRN = rn.decodeJpeg;
}

// Chargés uniquement sur Web
let bodyPix = null;
let faceLm = null;

async function ensureBodyPix() {
  if (Platform.OS !== 'web') return null;
  if (bodyPix) return bodyPix;
  try {
    bodyPix = await import('@tensorflow-models/body-pix');
  } catch {
    bodyPix = null;
  }
  return bodyPix;
}

async function ensureFaceLm() {
  if (Platform.OS !== 'web') return null;
  if (faceLm) return faceLm;
  try {
    faceLm = await import('@tensorflow-models/face-landmarks-detection');
  } catch {
    faceLm = null;
  }
  return faceLm;
}

// Assurer TF prêt (et bindings natifs si nécessaire)
async function ensureTfReady() {
  if (Platform.OS !== 'web') {
    await ensureNativeBindings();
    await tf.ready();
    return;
  }
  // Web: utiliser le backend WASM pour éviter unsafe-eval
  try {
    const wasm = await import('@tensorflow/tfjs-backend-wasm');
    // Charger les assets WASM depuis un CDN (compatible dev). Vous pouvez self-host plus tard.
    if (wasm && wasm.setWasmPaths) {
      // Version alignée sur celle du lockfile si possible
      wasm.setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.20.0/dist/');
    }
    await tf.setBackend('wasm');
  } catch (e) {
    // fallback webgl si wasm indisponible
    try { await tf.setBackend('webgl'); } catch {}
  }
  await tf.ready();
}

// Charger un modèle visage une seule fois
let faceModel = null;
async function ensureFaceModel() {
  if (faceModel) return faceModel;
  try {
    faceModel = await blazeface.load();
  } catch {
    faceModel = null;
  }
  return faceModel;
}

function base64ToImageElement(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

function rgbToHsv(r, g, b) {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)); break;
      case g1: h = (b1 - r1) / d + 2; break;
      case b1: h = (r1 - g1) / d + 4; break;
    }
    h /= 6;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return [h, s, v];
}

function makeHeatmap(values, gridW, gridH) {
  // Normalise 0..1
  const max = values.length ? Math.max(...values) : 1;
  return values.map(v => max > 0 ? Math.min(1, Math.max(0, v / max)) : 0);
}

function analyzeTensorWithOptionalFace(tSrc, imgW, imgH, faceBox) {
  // tSrc: Tensor3D uint8 [H,W,3]
  let roiTensor = null;
  let boxNorm = null;
  if (faceBox) {
    const x = Math.max(0, Math.floor(faceBox.x));
    const y = Math.max(0, Math.floor(faceBox.y));
    const w = Math.max(1, Math.floor(faceBox.w));
    const h = Math.max(1, Math.floor(faceBox.h));
    // slice([row, col, channel]) => rows=y, cols=x
    roiTensor = tf.slice(tSrc, [y, x, 0], [h, w, 3]);
    boxNorm = { x: x / imgW, y: y / imgH, width: w / imgW, height: h / imgH };
  }
  const tensor = roiTensor ? roiTensor : tSrc;

  // Travailler sur une taille réduite pour calculs
  const resized = tf.image.resizeBilinear(tensor, [128, 128]).toFloat();
  const norm = resized.div(255);

  // Récupérer données pour heuristique de peau & heatmap
  return tf.tidy(() => {
    return { norm, boxNorm };
  });
}

function buildMaskFromParts128(faceBox, imgW, imgH, seg, facePartIdsSet, hairPartIdsSet) {
  // seg: { width, height, data: Uint8Array of part ids }
  const maskW = 128, maskH = 128;
  const maskSkin = new Uint8Array(maskW * maskH);
  const maskHair = new Uint8Array(maskW * maskH);
  const segW = seg?.width || 0;
  const segH = seg?.height || 0;
  const segData = seg?.data || null;
  if (!segData || !segW || !segH || !faceBox) return { maskSkin, maskHair };
  for (let y = 0; y < maskH; y++) {
    for (let x = 0; x < maskW; x++) {
      const fx = faceBox.x + (x / maskW) * faceBox.w;
      const fy = faceBox.y + (y / maskH) * faceBox.h;
      const ix = Math.min(segW - 1, Math.max(0, Math.floor((fx / imgW) * segW)));
      const iy = Math.min(segH - 1, Math.max(0, Math.floor((fy / imgH) * segH)));
      const pid = segData[iy * segW + ix];
      const isFace = facePartIdsSet.has(pid);
      const isHair = hairPartIdsSet.has(pid);
      maskSkin[y * maskW + x] = isFace ? 1 : 0;
      maskHair[y * maskW + x] = isHair ? 1 : 0;
    }
  }
  return { maskSkin, maskHair };
}

function computeMetricsAndHeatmapFromData(data, width = 128, height = 128, maskSkinOpt) {
  let sumV = 0, redCount = 0, n = 0;
  const grid = 16;
  const cellW = Math.floor(width / grid);
  const cellH = Math.floor(height / grid);
  const heatVals = new Array(grid * grid).fill(0);
  const heatCount = new Array(grid * grid).fill(0);
  let hairLowVCount = 0, hairSamples = 0; // conservé pour compat basique

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const m = maskSkinOpt ? maskSkinOpt[y * width + x] : 1;
      const i = (y * width + x) * 3;
      const r = data[i] * 255;
      const g = data[i + 1] * 255;
      const b = data[i + 2] * 255;
      const [h, s, v] = rgbToHsv(r, g, b);

      if (m) {
        sumV += v;
        if (h > 0.95 || h < 0.05) {
          redCount += s > 0.3 ? 1 : 0;
        }
        const redness = (h > 0.95 || h < 0.05) ? (s * v) : 0;
        const cx = Math.min(grid - 1, Math.floor(x / cellW));
        const cy = Math.min(grid - 1, Math.floor(y / cellH));
        const ci = cy * grid + cx;
        heatVals[ci] += redness;
        heatCount[ci] += 1;
        n++;
      }

      // approx cheveux (bande haute sombre) si pas de masque
      if (!maskSkinOpt && y < Math.floor(height * 0.25)) {
        hairSamples++;
        if (v < 0.35 && s < 0.35) hairLowVCount++;
      }
    }
  }

  const brightness = n ? (sumV / n) : 0.5;
  const redness = n ? (redCount / n) : 0.0;

  let skinType = 'normal';
  if (brightness >= 0.68) skinType = 'gras';
  else if (brightness <= 0.38) skinType = 'sec';

  const needs = [];
  if (redness > 0.06) needs.push('protection');
  if (skinType === 'sec') needs.push('hydratation');
  if (skinType === 'gras') needs.push('fraîcheur');

  const hairRatio = hairSamples ? (hairLowVCount / hairSamples) : 0.3;
  const hairDensity = hairRatio > 0.55 ? 'élevée' : hairRatio > 0.35 ? 'moyenne' : 'faible';

  const heatAvg = heatVals.map((v, i) => heatCount[i] ? (v / heatCount[i]) : 0);
  const heatmap = makeHeatmap(heatAvg, 16, 16);

  const metrics = {
    brightness,
    redness,
    shineLevel: brightness >= 0.66 ? 'élevée' : brightness >= 0.33 ? 'moyenne' : 'faible',
    rednessLevel: redness >= 0.66 ? 'élevée' : redness >= 0.33 ? 'moyenne' : 'faible',
  };

  return { skinType, needs: Array.from(new Set(needs)).slice(0, 3), metrics, hair: { density: hairDensity, notes: 'Segmentation appliquée' }, heatmap, grid: 16 };
}

function estimateBlurScore128(data, width = 128, height = 128) {
  // simple gradient magnitude approximation (Sobel-like on 3 channels)
  let sum = 0, count = 0;
  const idx = (x,y,c) => ((y*width + x)*3 + c);
  for (let y = 1; y < height-1; y++) {
    for (let x = 1; x < width-1; x++) {
      let gx = 0, gy = 0;
      for (let c = 0; c < 3; c++) {
        const a = data[idx(x+1,y,c)] - data[idx(x-1,y,c)];
        const b = data[idx(x,y+1,c)] - data[idx(x,y-1,c)];
        gx += a*a; gy += b*b;
      }
      const g = Math.sqrt(gx + gy);
      sum += g; count++;
    }
  }
  const meanGrad = count ? sum / count : 0;
  // plus c'est élevé, moins c'est flou; normalisation approx
  return Math.max(0, Math.min(1, meanGrad * 3));
}

export async function analyzeFaceFromBase64(base64) {
  await ensureTfReady();

  if (Platform.OS === 'web') {
    try {
      const img = await base64ToImageElement(base64);
      const src = tf.browser.fromPixels(img);
      const imgH = src.shape[0], imgW = src.shape[1];

      const model = await ensureFaceModel();
      let faceBox = null;
      if (model) {
        const preds = await model.estimateFaces(img, false);
        if (preds && preds.length > 0) {
          const biggest = preds.reduce((a, b) => {
            const aSize = (a.bottomRight[0] - a.topLeft[0]) * (a.bottomRight[1] - a.topLeft[1]);
            const bSize = (b.bottomRight[0] - b.topLeft[0]) * (b.bottomRight[1] - b.topLeft[1]);
            return aSize >= bSize ? a : b;
          });
          const x = Math.max(0, Math.floor(biggest.topLeft[0]));
          const y = Math.max(0, Math.floor(biggest.topLeft[1]));
          const w = Math.max(1, Math.ceil(biggest.bottomRight[0]) - x);
          const h = Math.max(1, Math.ceil(biggest.bottomRight[1]) - y);
          faceBox = { x, y, w, h };
        }
      }

      // BodyPix segmentation (web)
      let maskSkin128 = null;
      let faceBoxNorm = null;
      if (faceBox) {
        faceBoxNorm = { x: faceBox.x / imgW, y: faceBox.y / imgH, width: faceBox.w / imgW, height: faceBox.h / imgH };
      }
      const bp = await ensureBodyPix();
      if (bp) {
        const bpModel = await bp.load({ architecture: 'MobileNetV1', outputStride: 16, multiplier: 0.75, quantBytes: 2 });
        const seg = await bpModel.segmentPersonParts(img, { segmentationThreshold: 0.7, multiPersonDecoding: false });
        const faceIds = new Set([...(bp.partIdsByCategory.face||[]), ...(bp.partIdsByCategory.leftFace||[]), ...(bp.partIdsByCategory.rightFace||[])]);
        const hairIds = new Set([...(bp.partIdsByCategory.hair||[])]);
        const { maskSkin } = buildMaskFromParts128(faceBox || {x:0,y:0,w:imgW,h:imgH}, imgW, imgH, seg, faceIds, hairIds);
        maskSkin128 = maskSkin;
      }

      // Extraire ROI 128x128
      let norm = null;
      if (faceBox) {
        const roi = tf.slice(src, [faceBox.y, faceBox.x, 0], [faceBox.h, faceBox.w, 3]);
        const resized = tf.image.resizeBilinear(roi, [128, 128]).toFloat();
        norm = tf.tidy(() => resized.div(255));
        roi.dispose(); resized.dispose?.();
      } else {
        const resized = tf.image.resizeBilinear(src, [128, 128]).toFloat();
        norm = tf.tidy(() => resized.div(255));
        resized.dispose?.();
      }

      const data = await norm.data();
      src.dispose();
      norm.dispose();

      const { skinType, needs, metrics, hair, heatmap, grid } = computeMetricsAndHeatmapFromData(data, 128, 128, maskSkin128);
      const blurScore = estimateBlurScore128(data, 128, 128);

      // Landmarks (web) pour eye openness simple
      let quality = { blurScore, backlight: metrics.brightness < 0.18 || metrics.brightness > 0.9 ? 'mauvais' : metrics.brightness < 0.3 || metrics.brightness > 0.8 ? 'moyen' : 'bon' };
      const lmns = await ensureFaceLm();
      if (lmns && faceBox) {
        try {
          const lmModel = await lmns.load(lmns.SupportedPackages.mediapipeFacemesh);
          const preds = await lmModel.estimateFaces({ input: img });
          if (preds && preds[0]?.keypoints) {
            const kps = preds[0].keypoints; // array with .x,.y
            const getD = (a,b) => Math.hypot(kps[a].x - kps[b].x, kps[a].y - kps[b].y);
            // indices MediaPipe (approx): left eye top/bottom 159/145, right 386/374
            const leftOpen = getD(159,145) / (faceBox.h || 1);
            const rightOpen = getD(386,374) / (faceBox.h || 1);
            quality.eyeLeftOpen = leftOpen;
            quality.eyeRightOpen = rightOpen;
          }
        } catch {}
      }

      const guidance = [];
      if (blurScore < 0.18) guidance.push('Photo floue: stabilisez l’appareil.');
      if (quality.backlight !== 'bon') guidance.push('Éclairage difficile: évitez le contre-jour.');
      if ((quality.eyeLeftOpen ?? 0.05) < 0.03 || (quality.eyeRightOpen ?? 0.05) < 0.03) guidance.push('Gardez les yeux ouverts.');

      return {
        skinType,
        needs,
        metrics,
        hair,
        notes: metrics.redness > 0.06 ? ['Rougeurs détectées (sensibilité)'] : [],
        quality: { ...quality, guidance },
        face: faceBoxNorm ? { boxNormalized: faceBoxNorm, heatmap: { grid, values: heatmap } } : null,
      };
    } catch (e) {
      return fallbackHeuristic(base64);
    }
  }

  // RN (mobile): on garde la segmentation heuristique + perfs/tidy
  try {
    await ensureNativeBindings();
    const u8 = base64js.toByteArray(base64);
    const src = decodeJpegRN(u8, 3);
    const imgH = src.shape[0], imgW = src.shape[1];

    const model = await ensureFaceModel();
    let faceBox = null;
    if (model) {
      const preds = await model.estimateFaces(src, false);
      if (preds && preds.length > 0) {
        const biggest = preds.reduce((a, b) => {
          const aSize = (a.bottomRight[0] - a.topLeft[0]) * (a.bottomRight[1] - a.topLeft[1]);
          const bSize = (b.bottomRight[0] - b.topLeft[0]) * (b.bottomRight[1] - b.topLeft[1]);
          return aSize >= bSize ? a : b;
        });
        const x = Math.max(0, Math.floor(biggest.topLeft[0]));
        const y = Math.max(0, Math.floor(biggest.topLeft[1]));
        const w = Math.max(1, Math.ceil(biggest.bottomRight[0]) - x);
        const h = Math.max(1, Math.ceil(biggest.bottomRight[1]) - y);
        faceBox = { x, y, w, h };
      }
    }

    let norm = null;
    let faceBoxNorm = null;
    if (faceBox) {
      faceBoxNorm = { x: faceBox.x / imgW, y: faceBox.y / imgH, width: faceBox.w / imgW, height: faceBox.h / imgH };
      const roi = tf.slice(src, [faceBox.y, faceBox.x, 0], [faceBox.h, faceBox.w, 3]);
      const resized = tf.image.resizeBilinear(roi, [128, 128]).toFloat();
      norm = tf.tidy(() => resized.div(255));
      roi.dispose(); resized.dispose?.();
    } else {
      const resized = tf.image.resizeBilinear(src, [128, 128]).toFloat();
      norm = tf.tidy(() => resized.div(255));
      resized.dispose?.();
    }

    const data = await norm.data();
    src.dispose();
    norm.dispose();

    const { skinType, needs, metrics, hair, heatmap, grid } = computeMetricsAndHeatmapFromData(data, 128, 128, null);
    const blurScore = estimateBlurScore128(data, 128, 128);
    const guidance = [];
    if (blurScore < 0.18) guidance.push('Photo floue: stabilisez l’appareil.');
    if (metrics.brightness < 0.18 || metrics.brightness > 0.9) guidance.push('Éclairage difficile: évitez le contre-jour.');

    return {
      skinType,
      needs,
      metrics,
      hair,
      notes: metrics.redness > 0.06 ? ['Rougeurs détectées (sensibilité)'] : [],
      quality: { blurScore, guidance },
      face: faceBoxNorm ? { boxNormalized: faceBoxNorm, heatmap: { grid, values: heatmap } } : null,
    };
  } catch (e) {
    return fallbackHeuristic(base64);
  }
}

// Fallback heuristique si TF non dispo (ex: mobile sans fromPixels)
function fallbackHeuristic(base64) {
  try {
    const byteArray = base64js.toByteArray(base64);
    let sum = 0, high = 0;
    const step = Math.max(1, Math.floor(byteArray.length / 6000));
    for (let i = 0; i < byteArray.length; i += step) {
      const v = byteArray[i]; sum += v; if (v > 220) high++;
    }
    const samples = Math.max(1, Math.floor(byteArray.length / step));
    const brightness = (sum / samples) / 255;
    const redness = high / samples;

    let skinType = 'normal';
    if (brightness >= 0.7) skinType = 'gras';
    else if (brightness <= 0.35) skinType = 'sec';

    const needs = [];
    if (redness > 0.05) needs.push('protection');
    if (skinType === 'sec') needs.push('hydratation');
    if (skinType === 'gras') needs.push('fraîcheur');

    return {
      skinType,
      needs: Array.from(new Set(needs)).slice(0, 3),
      metrics: {
        brightness,
        redness,
        shineLevel: brightness >= 0.66 ? 'élevée' : brightness >= 0.33 ? 'moyenne' : 'faible',
        rednessLevel: redness >= 0.66 ? 'élevée' : redness >= 0.33 ? 'moyenne' : 'faible',
      },
      hair: { density: 'moyenne', notes: 'Estimation basique' },
      notes: redness > 0.05 ? ['Rougeurs détectées (sensibilité)'] : [],
      face: null,
    };
  } catch {
    return { skinType: 'normal', needs: ['hydratation'], metrics: { brightness: 0.5, redness: 0.0, shineLevel: 'moyenne', rednessLevel: 'faible' }, hair: { density: 'moyenne' }, notes: [], face: null };
  }
}
