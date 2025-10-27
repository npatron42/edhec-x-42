export function hairVolumeRatio(maskHair){
  const n = maskHair.length; if (!n) return 0;
  let sum = 0; for (let i=0;i<n;i++) sum += maskHair[i] ? 1 : 0;
  return sum / n;
}

export function hairShineProxyHSV(rgbFloat, maskHair){
  let sumV = 0, n=0;
  for (let i=0;i<maskHair.length;i++){
    if (!maskHair[i]) continue;
    const r = rgbFloat[i*3+0], g = rgbFloat[i*3+1], b = rgbFloat[i*3+2];
    const V = Math.max(r,g,b);
    sumV += V; n++;
  }
  return n ? Math.min(1, Math.max(0, sumV/n)) : 0.5;
}

export function hairFrizzProxyGLCM(gray, maskHair, width, height){
  // Très simplifié: variance locale comme proxy de texture
  let sum=0, sum2=0, n=0;
  for (let y=1;y<height-1;y++){
    for (let x=1;x<width-1;x++){
      const i = y*width + x;
      if (!maskHair[i]) continue;
      const v = gray[i];
      sum += v; sum2 += v*v; n++;
    }
  }
  if (!n) return 0.3;
  const mean = sum/n; const varg = Math.max(0, sum2/n - mean*mean);
  const norm = Math.min(1, varg / 0.05);
  return norm;
}
