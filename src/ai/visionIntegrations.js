// Unifié: intégrations MediaPipe Tasks (web) et fallbacks pour segmentation/landmarks
// Objectif: fournir ROI visage + masques peau/cheveux 128x128 si disponibles
// Web: @mediapipe/tasks-vision (WASM) ou BodyPix; RN: hooks prévus pour natif, fallback heuristique

import { Platform } from 'react-native';

let tasksVision = null;
let faceLandmarker = null;
let imageSegmenterHair = null;
let imageSegmenterSkin = null;

async function ensureTasksVisionWeb(){
  if (Platform.OS !== 'web') return null;
  if (tasksVision) return tasksVision;
  try {
    tasksVision = await import('@mediapipe/tasks-vision');
  } catch {
    tasksVision = null;
  }
  return tasksVision;
}

async function createFaceLandmarkerWeb(){
  const tv = await ensureTasksVisionWeb();
  if (!tv) return null;
  if (faceLandmarker) return faceLandmarker;
  try {
    const wasmBase = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';
    const vision = await tv.FilesetResolver.forVisionTasks(wasmBase);
    faceLandmarker = await tv.FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task' },
      runningMode: 'IMAGE',
      numFaces: 1,
    });
  } catch {
    faceLandmarker = null;
  }
  return faceLandmarker;
}

async function createImageSegmenterWeb(kind){
  const tv = await ensureTasksVisionWeb();
  if (!tv) return null;
  // kind: 'hair' | 'skin'
  try {
    const wasmBase = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';
    const vision = await tv.FilesetResolver.forVisionTasks(wasmBase);
    const modelUrl = kind === 'hair'
      ? (globalThis.__HAIR_SEGMENTER_URL__ || null)
      : (globalThis.__SKIN_SEGMENTER_URL__ || null);
    if (!modelUrl) return null;
    const seg = await tv.ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelUrl },
      runningMode: 'IMAGE',
      outputCategoryMask: true,
    });
    return seg;
  } catch {
    return null;
  }
}

export async function getFaceRoiWeb(imageBitmap){
  const lm = await createFaceLandmarkerWeb();
  if (!lm) return null;
  try {
    const res = lm.detect(imageBitmap);
    const face = res?.faceLandmarks?.[0];
    const box = res?.faceBoundingBoxes?.[0];
    if (box){
      const { originX, originY, width, height } = box;
      return { x: originX, y: originY, w: width, h: height };
    }
    if (face && face.length){
      // Fallback: bbox from landmarks
      let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
      for (const p of face){ minX=Math.min(minX,p.x); minY=Math.min(minY,p.y); maxX=Math.max(maxX,p.x); maxY=Math.max(maxY,p.y);}    
      return { x: minX, y: minY, w: (maxX-minX), h: (maxY-minY) };
    }
  } catch {}
  return null;
}

export async function getSegmentationMasksWeb(imageBitmap, targetW=128, targetH=128){
  let hairMask = null, skinMask = null;
  // Tenter Tasks ImageSegmenter si modèles fournis globalement
  try {
    if (!imageSegmenterHair) imageSegmenterHair = await createImageSegmenterWeb('hair');
    if (!imageSegmenterSkin) imageSegmenterSkin = await createImageSegmenterWeb('skin');
    const segToMask = (seg) => {
      if (!seg) return null;
      const mask = new Uint8Array(targetW*targetH);
      const m = seg.categoryMask.getAsFloat32Array();
      // Remap simple: >0.5 → 1
      const srcW = seg.categoryMask.width, srcH = seg.categoryMask.height;
      for (let y=0;y<targetH;y++){
        for (let x=0;x<targetW;x++){
          const ix = Math.min(srcW-1, Math.floor(x*srcW/targetW));
          const iy = Math.min(srcH-1, Math.floor(y*srcH/targetH));
          const v = m[iy*srcW + ix];
          mask[y*targetW + x] = v > 0.5 ? 1 : 0;
        }
      }
      return mask;
    };
    if (imageSegmenterHair) {
      const out = imageSegmenterHair.segment(imageBitmap);
      hairMask = segToMask(out);
    }
    if (imageSegmenterSkin) {
      const out = imageSegmenterSkin.segment(imageBitmap);
      skinMask = segToMask(out);
    }
  } catch {}
  // Fallback: nulls -> pipeline fera heuristiques
  return { hairMask, skinMask };
}

// RN: points d’extension (native module)
export async function getFaceRoiNative(base64){
  // TODO Phase 3: appeler module natif MediaPipe Tasks
  return null;
}
export async function getSegmentationMasksNative(base64, targetW=128, targetH=128){
  // TODO Phase 3: appeler module natif MediaPipe Tasks
  return { hairMask: null, skinMask: null };
}
