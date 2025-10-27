// Envoi du selfie + contexte à Google Gemini (Generative Language API) pour une analyse et recommandations.
// Retour aligné avec analyzeWithChatGPT: { analysis: {...}, recommendations: Product[], rationale: string }
import { getGeminiKey } from '../env/config';

const VERSION_CANDIDATES = ['v1beta', 'v1'];
const MODEL_CANDIDATES = [
  // Priorité aux modèles 2.x
  // 'gemini-2.5-pro', // optionnel selon accès
  'gemini-2.5-flash',
  'gemini-2.0-pro-latest',
  'gemini-2.0-pro',
  'gemini-2.0-pro-exp',
  'gemini-2.0-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  // Fallback 1.5
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro-vision',
];

export async function analyzeWithGemini({ base64, envSignals, products }){
  const apiKey = getGeminiKey();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY manquant.');
    err.code = 401; throw err;
  }

  const prompt = buildPrompt({ envSignals, products });

  let lastError = null;
  for (const ver of VERSION_CANDIDATES) {
    for (const model of MODEL_CANDIDATES) {
      // Construire le body selon la version
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64,
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          // response_mime_type non supporté par v1 → on l'ajoute seulement pour v1beta
          ...(ver === 'v1beta' ? { response_mime_type: 'application/json' } : {}),
        }
      };

      const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      try {
        console.log('[AI][Gemini] Appel', { ver, model, base64Length: base64?.length || 0 });
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) {
          let raw = ''; try { raw = await res.text(); } catch {}
          console.warn('[AI][Gemini] HTTP error', { ver, model, status: res.status, bodyPreview: (raw||'').slice(0,300) });
          const err = new Error(raw || `Gemini HTTP ${res.status}`);
          err.code = res.status; lastError = err; continue;
        }
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let data; try { data = JSON.parse(text); } catch { data = {}; }

        // Mapper les recommandations retournées vers notre catalogue
        let mapped = Array.isArray(data.recommendations) ? data.recommendations.map((r) => {
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

          return {
            ...match,
            matchScore,
            description: shortDesc || match.description,
            _reasons: reasons.length ? reasons : match._reasons,
          };
        }).filter(Boolean) : [];

        // Dédupliquer par id
        const seen = new Set();
        mapped = mapped.filter(p => {
          const id = String(p.id);
          if (seen.has(id)) return false; seen.add(id); return true;
        });

        // Forcer au moins 3 excellents matchs (score >= 85)
        const excellentCount = mapped.filter(p => (p.matchScore || 0) >= 85).length;
        if (excellentCount < 3 && mapped.length) {
          const needBoost = 3 - excellentCount;
          const sorted = [...mapped].sort((a,b)=> (b.matchScore||0) - (a.matchScore||0));
          for (let i=0; i<needBoost && i<sorted.length; i++) {
            sorted[i].matchScore = Math.max(sorted[i].matchScore || 0, 90);
          }
          // Merge boosted scores back
          const boostedById = Object.fromEntries(sorted.map(x => [String(x.id), x.matchScore]));
          mapped = mapped.map(x => ({ ...x, matchScore: boostedById[String(x.id)] ?? x.matchScore }));
        }

        // Compléter à 8 cartes avec des produits du catalogue « un peu moins » adaptés
        if (mapped.length < 8) {
          const selectedIds = new Set(mapped.map(p => String(p.id)));
          for (const prod of products) {
            if (mapped.length >= 8) break;
            const pid = String(prod.id);
            if (selectedIds.has(pid)) continue;
            mapped.push({
              ...prod,
              matchScore: 55, // volontairement moyen
              description: prod.description,
              _reasons: prod._reasons || [],
            });
            selectedIds.add(pid);
          }
        }
        // Tronquer si plus de 8
        if (mapped.length > 8) mapped = mapped.slice(0, 8);

        console.log('[AI][Gemini] Réponse OK', { ver, model, recs: mapped.length });
        return {
          analysis: data.analysis || {},
          rationale: typeof data.rationale === 'string' ? data.rationale : '',
          recommendations: mapped,
        };
      } catch (e) {
        console.warn('[AI][Gemini] Exception', { ver, model, message: e?.message });
        lastError = e;
      }
    }
  }
  throw lastError || new Error('Gemini indisponible');
}

function buildPrompt({ envSignals, products }){
  const catalog = products.map(p => ({ id: p.id, name: p.name, category: p.category, benefits: p.benefits }));
  return [
    'Tu es un expert dermo-cosmétique et visagiste.',
    'Reçois un selfie (image jointe), des signaux environnement (UV, pollution, humidité...), et un catalogue de produits Dove.',
    'Objectif: renvoyer STRICTEMENT un JSON (sans texte autour) avec:',
    "analysis: { skin_type: 'sec|normal|gras|mixte|sensible', needs: string[], notes: string[], hair: { type: 'raide|ondulé|bouclé|crépu|--', density: 'faible|moyenne|élevée', frizz: number(0..1), shine: number(0..1) } }",
    'recommendations: ProductRef[] EXACTEMENT 8 éléments issus du catalogue fourni, chacun sous la forme:',
    "{ id|name|category, match_score: 0-100, short_description: string<=160, reasons?: string[] }",
    "Contraintes: au moins 3 produits avec match_score ≥ 85 (excellent), le reste varié avec des scores plus faibles.",
    "N'utilise pas d'IDs inventés. Prends id/name/category exactement depuis le catalogue.",
    'Rédige short_description en français, concise et orientée bénéfices.',
    "Hair: si les cheveux ne sont pas clairement visibles, indique type='--' et laisse frizz/shine à 0.5 par défaut; sinon estime-les prudemment.",
    'Règles: privilégier hydratation si peau/ambiance sèches, apaisement si rougeurs, éclat si UV élevés.',
    'Catalogue: ' + JSON.stringify(catalog),
    'Environnement: ' + JSON.stringify(envSignals || {}),
  ].join('\n');
}
