// Envoi du selfie + contexte à Google Gemini (Generative Language API) pour une analyse et recommandations.
// Retour aligné avec analyzeWithChatGPT: { analysis: {...}, recommendations: Product[], rationale: string }
import { getGeminiKey } from '../env/config';
import { vaselineProducts as localCatalog, doveProducts as aliasCatalog } from '../data/products';

// Utiliser uniquement l'API v1beta (plus tolérante et compatible)
const VERSION_CANDIDATES = ['v1beta'];
// Modèles compatibles par version (évite les 404 NOT_FOUND)
const MODELS_BY_VERSION = {
  v1beta: [
    'gemini-2.5-flash',
  ],
};

const REQ_TIMEOUT_MS = 120000;
const BUDGET_TIMEOUT_MS = 180000;

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

export async function analyzeWithGemini({ base64, envSignals, products }){
  const apiKey = getGeminiKey();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY manquant.');
    err.code = 401; throw err;
  }

  // Sélection robuste du catalogue
  const catalog = Array.isArray(products) && products.length
    ? products
    : (Array.isArray(aliasCatalog) && aliasCatalog.length ? aliasCatalog : (Array.isArray(localCatalog) ? localCatalog : []));

  const prompt = buildPrompt({ envSignals, products: catalog });

  let lastError = null;
  const started = Date.now();
  for (const ver of VERSION_CANDIDATES) {
    const modelList = MODELS_BY_VERSION[ver] || [];
    for (const model of modelList) {
      if (Date.now() - started > BUDGET_TIMEOUT_MS) { lastError = lastError || new Error('Timeout monolithique'); break; }
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: base64 } }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          ...(ver === 'v1beta' ? { response_mime_type: 'application/json' } : {}),
        }
      };

      const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      try {
        const res = await fetchWithTimeout(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, REQ_TIMEOUT_MS);
        if (!res.ok) {
          let raw = ''; try { raw = await res.text(); } catch {}
          const err = new Error(raw || `Gemini HTTP ${res.status}`);
          err.code = res.status; lastError = err; continue;
        }
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let data; try { data = JSON.parse(text); } catch { data = {}; }

        // Tolérance si le modèle retourne un objet directement
        if (!data.analysis && json?.candidates?.[0]?.content?.parts?.[0]?.text && typeof json.candidates[0].content.parts[0].text === 'object') {
          data = json.candidates[0].content.parts[0].text;
        }

        const safeCatalog = Array.isArray(catalog) ? catalog : [];
        let mapped = Array.isArray(data.recommendations) ? data.recommendations.map((r) => {
          const rid = r?.id != null ? String(r.id).trim() : null;
          const rname = r?.name ? String(r.name).trim().toLowerCase() : null;
          let match = rid ? safeCatalog.find(p => String(p.id) === rid) : null;
          if (!match && rname) match = safeCatalog.find(p => String(p.name||'').trim().toLowerCase() === rname);
          if (!match) return null; // strict: seulement le catalogue local

          const rawScore = typeof r?.match_score === 'number' ? r.match_score : undefined;
          const matchScore = Math.max(0, Math.min(100, rawScore ?? (match.matchScore ?? 0)));
          const shortDesc = typeof r?.short_description === 'string' ? r.short_description.slice(0, 160) : null;
          const reasons = Array.isArray(r?.reasons) ? r.reasons.map(x => String(x)).slice(0,3) : [];

          return {
            ...match,
            matchScore,
            description: shortDesc || match.description,
            _reasons: reasons.length ? reasons : match._reasons,
          };
        }).filter(Boolean) : [];

        // Déduplication & boost si nécessaire
        const seen = new Set();
        mapped = mapped.filter(p => { const id = String(p.id); if (seen.has(id)) return false; seen.add(id); return true; });

        const excellentCount = mapped.filter(p => (p.matchScore || 0) >= 85).length;
        if (excellentCount < 3 && mapped.length) {
          const needBoost = 3 - excellentCount;
          const sorted = [...mapped].sort((a,b)=> (b.matchScore||0) - (a.matchScore||0));
          for (let i=0; i<needBoost && i<sorted.length; i++) sorted[i].matchScore = Math.max(sorted[i].matchScore || 0, 90);
          const boostedById = Object.fromEntries(sorted.map(x => [String(x.id), x.matchScore]));
          mapped = mapped.map(x => ({ ...x, matchScore: boostedById[String(x.id)] ?? x.matchScore }));
        }

        // Compléter jusqu'à 8 avec le catalogue local si besoin
        if (mapped.length < 8) {
          const selectedIds = new Set(mapped.map(p => String(p.id)));
          for (const prod of safeCatalog) {
            if (mapped.length >= 8) break;
            const pid = String(prod.id);
            if (selectedIds.has(pid)) continue;
            mapped.push({ ...prod, matchScore: 55, description: prod.description, _reasons: prod._reasons || [] });
            selectedIds.add(pid);
          }
        }
        if (mapped.length > 8) mapped = mapped.slice(0, 8);

        return { analysis: data.analysis || {}, rationale: typeof data.rationale === 'string' ? data.rationale : '', recommendations: mapped };
      } catch (e) {
        lastError = e.name === 'AbortError' ? new Error('Timeout requête Gemini') : e;
      }
    }
  }
  throw lastError || new Error('Gemini indisponible');
}

function buildPrompt({ envSignals, products }){
  const safeProducts = Array.isArray(products) ? products : [];
  const catalog = safeProducts.map(p => ({ id: p.id, name: p.name, category: p.category, benefits: p.benefits, skinTypes: p.skinTypes, environment: p.environment }));
  return [
    'Tu es un expert dermo-cosmétique et visagiste.',
    "Reçois un selfie (image jointe), des signaux environnement (UV, pollution, humidité...), et un catalogue de produits Vaseline (liste fournie).",
    'Objectif: renvoyer STRICTEMENT un JSON (sans texte autour) avec:',
    "analysis: { skin_type: 'sec|normal|gras|mixte|sensible', needs: string[], notes: string[], hair: { type: 'raide|ondulé|bouclé|crépu|--', density: 'faible|moyenne|élevée', frizz: number(0..1), shine: number(0..1) } }",
    'recommendations: ProductRef[] EXACTEMENT 8 éléments issus du catalogue fourni, chacun sous la forme:',
    "{ id|name, category, match_score: 0-100, short_description: string<=160, reasons?: string[] }",
    "Contraintes: choisis UNIQUEMENT des produits du catalogue fourni. Utilise l'id et le name EXACTS du catalogue. N'invente pas d'ID/nom/catégorie.",
    "Assure au moins 3 produits avec match_score ≥ 85 (excellent), le reste varié avec des scores plus faibles.",
    'Rédige short_description en français, concise et orientée bénéfices.',
    "Hair: si les cheveux ne sont pas clairement visibles, indique type='--' et laisse frizz/shine à 0.5 par défaut; sinon estime-les prudemment.",
    "IMPORTANT: La photo est un visage/cheveux. Priorise les catégories liées au visage et aux lèvres (ex: 'soin-visage', 'soin-levres'). Dépriorise les catégories moins liées au visage comme 'soin-mains' sauf raison explicite.",
    'Règles: privilégier hydratation si peau/ambiance sèches, apaisement si rougeurs, éclat si UV élevés.',
    'Catalogue: ' + JSON.stringify(catalog),
    'Environnement: ' + JSON.stringify(envSignals || {}),
  ].join('\n');
}
