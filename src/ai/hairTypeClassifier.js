// Placeholder: classifier cheveux 4 classes avec règles simples basées sur texture/forme.
// Cible: remplacer par un modèle TFLite/TFJS (Straight/Wavy/Curly/Kinky) quand disponible.

export function classifyHairType({ frizz_proxy, curlinessProxy=0.3 }){
  // Heuristique basique: frizz ~ texture, curliness ~ boucles
  if (curlinessProxy < 0.2 && frizz_proxy < 0.3) return { label: 'Straight', confidence: 0.6 };
  if (curlinessProxy < 0.45) return { label: 'Wavy', confidence: 0.6 };
  if (curlinessProxy < 0.7) return { label: 'Curly', confidence: 0.65 };
  return { label: 'Kinky', confidence: 0.7 };
}
