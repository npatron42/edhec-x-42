// Recommandations à partir d'un JSON d'analyse + catalogue Vaseline.
import { getGeminiKey } from '../env/config';

const VERSION_CANDIDATES = ['v1beta', 'v1'];
const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-latest',
];

const REQ_TIMEOUT_MS = 10000;   // timeout par tentative
const BUDGET_TIMEOUT_MS = 16000; // budget global pour cette étape

async function fetchWithTimeout(url, options={}, timeoutMs=REQ_TIMEOUT_MS){
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch(e){
    clearTimeout(id);
    throw e;
  }
}

export async function recommendFromAnalysis({ analysisJson, products }){
  const apiKey = getGeminiKey();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY manquant.');
    err.code = 401; throw err;
  }
  const prompt = buildPrompt(analysisJson, products);

  let lastError = null;
  const started = Date.now();
  for (const ver of VERSION_CANDIDATES){
    for (const model of MODEL_CANDIDATES){
      if (Date.now() - started > BUDGET_TIMEOUT_MS) { lastError = lastError || new Error('Timeout recommandations'); break; }
      const body = {
        contents: [ { role: 'user', parts: [ { text: prompt } ] } ],
        generationConfig: {
          temperature: 0.2,
          ...(ver === 'v1beta' ? { response_mime_type: 'application/json' } : {}),
        },
      };
      const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      try {
        const res = await fetchWithTimeout(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, REQ_TIMEOUT_MS);
        if (!res.ok){
          let raw = ''; try { raw = await res.text(); } catch {}
          const err = new Error(raw || `Gemini HTTP ${res.status}`);
          err.code = res.status; lastError = err; continue;
        }
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let data; try { data = JSON.parse(text); } catch { data = {}; }

        const recs = normalizeRecs(data?.recommendations || data || [], products);
        return { recommendations: recs, rationale: data?.rationale || '' };
      } catch(e){ lastError = e; }
    }
  }
  throw lastError || new Error('Gemini indisponible');
}

function buildPrompt(analysis, products){
  const catalog = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    benefits: p.benefits,
    skinTypes: p.skinTypes,
    environment: p.environment,
    co2Saved: p.co2Saved,
    plasticSaved: p.plasticSaved,
    priceRegular: p.priceRegular,
    priceRefill: p.priceRefill,
  }));
  return [
    'Tu es un assistant dermo-cosmétique Vaseline. Base-toi UNIQUEMENT sur l’analyse JSON fournie et sur le catalogue ci-dessous.',
    'Renvoie STRICTEMENT un JSON sans texte autour:',
    "{ recommendations: ProductRef[8], rationale: string }",
    "ProductRef = { id|name|category, match_score: 0..100, short_description: string<=160, reasons?: string[] }",
    '- Contraintes: EXACTEMENT 8 éléments, au moins 3 avec match_score ≥ 85. Utilise uniquement des items du catalogue. Texte en français.',
    '- Attendues dans reasons: 1) besoin/concern détecté, 2) adéquation type de peau/cheveux/environnement, 3) mention du rapport qualité/prix (notamment le prix de recharge).',
    '- Pondère positivement les formules à bon prix de recharge quand plusieurs options sont équivalentes.',
    'Analyse: ' + JSON.stringify(analysis || {}),
    'Catalogue: ' + JSON.stringify(catalog),
  ].join('\n');
}

function normalizeRecs(arr, products){
  const list = Array.isArray(arr) ? arr : [];
  let mapped = list.map((r) => {
    const rid = r?.id != null ? String(r.id) : null;
    const rname = r?.name ? String(r.name).toLowerCase() : null;
    const rcat = r?.category ? String(r.category) : null;
    let match = rid ? products.find(p => String(p.id) === rid) : null;
    if (!match && rname) match = products.find(p => String(p.name||'').toLowerCase() === rname);
    if (!match && rcat) match = products.find(p => p.category === rcat);
    if (!match) return null;

    const rawScore = typeof r?.match_score === 'number' ? r.match_score : undefined;
    const matchScore = Math.max(0, Math.min(100, rawScore ?? (match.matchScore ?? 0)));
    const shortDesc = typeof r?.short_description === 'string' ? r.short_description.slice(0, 160) : null;
    const reasons = Array.isArray(r?.reasons) ? r.reasons.map(x => String(x)).slice(0,3) : [];

    return { ...match, matchScore, description: shortDesc || match.description, _reasons: reasons.length ? reasons : match._reasons };
  }).filter(Boolean);

  // Dédup + compléter/rogner à 8
  const seen = new Set();
  mapped = mapped.filter(p => { const id = String(p.id); if (seen.has(id)) return false; seen.add(id); return true; });
  if (mapped.length < 8){
    const selectedIds = new Set(mapped.map(p => String(p.id)));
    for (const prod of products){
      if (mapped.length >= 8) break;
      const pid = String(prod.id); if (selectedIds.has(pid)) continue;
      mapped.push({ ...prod, matchScore: 55, description: prod.description, _reasons: prod._reasons || [] });
      selectedIds.add(pid);
    }
  }
  if (mapped.length > 8) mapped = mapped.slice(0,8);

  // Booster 3 excellents
  const excellent = mapped.filter(p => (p.matchScore || 0) >= 85).length;
  if (excellent < 3 && mapped.length){
    const need = 3 - excellent; const sorted = [...mapped].sort((a,b)=> (b.matchScore||0)-(a.matchScore||0));
    for (let i=0;i<need && i<sorted.length;i++) sorted[i].matchScore = Math.max(sorted[i].matchScore||0, 90);
    const boosted = Object.fromEntries(sorted.map(x => [String(x.id), x.matchScore]));
    mapped = mapped.map(x => ({ ...x, matchScore: boosted[String(x.id)] ?? x.matchScore }));
  }
  return mapped;
}
