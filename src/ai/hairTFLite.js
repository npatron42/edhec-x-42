// Classifieur cheveux (TFLite via tfjs-tflite, Web uniquement pour l’instant)
// Usage: exposez globalThis.__HAIR_TFLITE_MODEL_URL__ = 'https://.../model.tflite';

import { Platform } from 'react-native';

let tflite = null;
let hairModel = null;
let tfjs = null;

async function ensureTfLiteWeb(){
  if (Platform.OS !== 'web') return null;
  if (tflite) return tflite;
  try {
    tflite = await import('@tensorflow/tfjs-tflite');
  } catch {
    tflite = null;
  }
  return tflite;
}

async function ensureTfjsWeb(){
  if (Platform.OS !== 'web') return null;
  if (tfjs) return tfjs;
  try {
    tfjs = await import('@tensorflow/tfjs');
  } catch {
    tfjs = null;
  }
  return tfjs;
}

export async function loadHairClassifierWeb(){
  const tfLite = await ensureTfLiteWeb();
  if (!tfLite) return null;
  if (hairModel) return hairModel;
  try {
    const url = globalThis.__HAIR_TFLITE_MODEL_URL__;
    if (!url) return null;
    hairModel = await tfLite.loadTFLiteModel(url);
  } catch {
    hairModel = null;
  }
  return hairModel;
}

// data128: Float32Array [128*128*3] range 0..1, hairMask Uint8Array [128*128]
export async function classifyHairTypeTFLiteIfAvailable(data128, hairMask){
  if (Platform.OS !== 'web') return null; // phase 3: natif
  const model = await loadHairClassifierWeb();
  const tf = await ensureTfjsWeb();
  if (!model || !tf) return null;
  try {
    const w=128,h=128;
    const buf = new Uint8Array(w*h*3);
    for (let i=0;i<buf.length;i++){
      const px = Math.min(255, Math.max(0, Math.round((data128[i]||0.5)*255)));
      const m = hairMask ? (hairMask[Math.floor(i/3)] ? 1 : 0.3) : 1;
      buf[i] = Math.round(px * m);
    }
    const input = tf.tensor3d(buf, [h, w, 3], 'int32').expandDims(0);
    const out = model.predict(input);
    const logits = Array.from(await out.data());
    input.dispose?.(); out.dispose?.();
    const labels = ['Straight','Wavy','Curly','Kinky'];
    let maxI=0, maxV=-Infinity;
    for (let i=0;i<logits.length;i++){ if (logits[i]>maxV){ maxV=logits[i]; maxI=i; } }
    const conf = softmaxAt(logits, maxI);
    return { label: labels[maxI] || 'Straight', confidence: conf };
  } catch {
    return null;
  }
}

function softmaxAt(arr, idx){
  const m = Math.max(...arr);
  const exps = arr.map(v => Math.exp(v - m));
  const sum = exps.reduce((a,b)=>a+b,0) || 1;
  return exps[idx] / sum;
}
