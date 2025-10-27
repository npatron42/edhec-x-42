// ITA & MST
function rgbToXyz(r, g, b) {
  // sRGB D65
  const srgb = [r, g, b].map(v => {
    v = v / 255;
    return v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  });
  const [R, G, B] = srgb;
  const X = R*0.4124 + G*0.3576 + B*0.1805;
  const Y = R*0.2126 + G*0.7152 + B*0.0722;
  const Z = R*0.0193 + G*0.1192 + B*0.9505;
  return [X, Y, Z];
}

function xyzToLab(X, Y, Z) {
  const refX = 0.95047, refY = 1.00000, refZ = 1.08883;
  const fx = (x) => x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16/116;
  const xr = X/refX, yr = Y/refY, zr = Z/refZ;
  const fxr = fx(xr), fyr = fx(yr), fzr = fx(zr);
  const L = (116 * fyr) - 16;
  const a = 500 * (fxr - fyr);
  const b = 200 * (fyr - fzr);
  return [L, a, b];
}

export function computeITAfromRGBRegion(u8rgb, mask) {
  // u8rgb: Uint8Array [H*W*3] in 0..255, mask: Uint8Array [H*W] 0/1
  let sumAngle = 0, n=0;
  for (let i=0;i<mask.length;i++){
    if (!mask[i]) continue;
    const r = u8rgb[i*3+0];
    const g = u8rgb[i*3+1];
    const b = u8rgb[i*3+2];
    const [X,Y,Z] = rgbToXyz(r,g,b);
    const [L, , bStar] = xyzToLab(X,Y,Z);
    const ita = Math.atan2(L - 50, bStar) * 180 / Math.PI;
    sumAngle += ita; n++;
  }
  const meanIta = n ? sumAngle/n : 0;
  return meanIta;
}

export function mstFromITA(ita){
  // Exemple de binning (à calibrer)
  if (ita > 55) return 0;
  if (ita > 41) return 1;
  if (ita > 28) return 2;
  if (ita > 10) return 3;
  if (ita > -10) return 4;
  if (ita > -30) return 5;
  if (ita > -40) return 6;
  if (ita > -55) return 7;
  if (ita > -70) return 8;
  return 9;
}
