import * as tf from '@tensorflow/tfjs';

export function estimateBlurScore128(rgbFloatData, width = 128, height = 128) {
  // Approx Laplacian variance using gradient magnitudes (Sobel-like)
  let sum = 0, count = 0;
  const idx = (x,y,c) => ((y*width + x)*3 + c);
  for (let y = 1; y < height-1; y++) {
    for (let x = 1; x < width-1; x++) {
      let gx = 0, gy = 0;
      for (let c = 0; c < 3; c++) {
        const a = rgbFloatData[idx(x+1,y,c)] - rgbFloatData[idx(x-1,y,c)];
        const b = rgbFloatData[idx(x,y+1,c)] - rgbFloatData[idx(x,y-1,c)];
        gx += a*a; gy += b*b;
      }
      const g = Math.sqrt(gx + gy);
      sum += g; count++;
    }
  }
  const meanGrad = count ? sum / count : 0;
  return Math.max(0, Math.min(1, meanGrad * 3));
}

export function estimateExposureFromV(rgbFloatData, width = 128, height = 128) {
  let sumV = 0, n = 0;
  for (let i = 0; i < width*height; i++) {
    const r = rgbFloatData[i*3+0];
    const g = rgbFloatData[i*3+1];
    const b = rgbFloatData[i*3+2];
    const max = Math.max(r, g, b);
    sumV += max; n++;
  }
  return n ? Math.min(1, Math.max(0, sumV / n)) : 0.5;
}
