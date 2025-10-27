import { doveProducts } from '../data/products';

// Exemple de règles simples. À remplacer par YAML si besoin.
export function recommendFromProfile(profile){
  const recs = [];
  const env = profile.env || {};
  const hair = profile.hair_features || {};
  const mst = profile.skin_tone?.mst_bin ?? 4;

  // Règle 1: Frizz + humidité
  if ((profile.hair_type === 'Curly' || profile.hair_type === 'Kinky') && (hair.frizz_proxy ?? 0) > 0.5 && (env.humidity ?? 0) > 70){
    addByCategory(recs, 'soin-corps'); // placeholder: mettre ta gamme anti-frizz quand elle sera dans le catalogue
  }

  // Règle 2: UV élevés
  if ((env.uv_index ?? 0) > 6){
    addByName(recs, 'Vaseline Healthy Bright');
  }

  // Règle 3: MST foncé
  if (mst >= 6){
    addByName(recs, 'Vaseline Lip Therapy Original');
  }

  // Fall back: compléter à 3 produits variés
  fillUp(recs, 3);
  return uniqueById(recs);
}

function addByCategory(list, cat){
  const found = doveProducts.find(p => p.category === cat);
  if (found) list.push(found);
}
function addByName(list, name){
  const found = doveProducts.find(p => p.name === name);
  if (found) list.push(found);
}
function fillUp(list, n){
  for (const p of doveProducts){ if (list.length >= n) break; if (!list.some(x => x.id === p.id)) list.push(p); }
}
function uniqueById(list){
  const seen = new Set();
  return list.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
}
