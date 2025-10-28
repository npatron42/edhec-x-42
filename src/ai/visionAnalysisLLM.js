// Analyse vision uniquement via Gemini: retourne un JSON d'analyse visage+cheveux, sans recommandations.
import { getGeminiKey } from '../env/config';

const VERSION_CANDIDATES = ['v1beta', 'v1'];
const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.0-pro-latest',
  'gemini-2.0-pro',
  'gemini-2.0-flash-latest',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
];

export async function analyzeVisionOnly({ base64, envSignals }){
  const apiKey = getGeminiKey();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY manquant.');
    err.code = 401; throw err;
  }
  const prompt = buildPrompt(envSignals || {});

  let lastError = null;
  for (const ver of VERSION_CANDIDATES){
    for (const model of MODEL_CANDIDATES){
      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: base64 } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          ...(ver === 'v1beta' ? { response_mime_type: 'application/json' } : {}),
        },
      };
      const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok){
          let raw = ''; try { raw = await res.text(); } catch {}
          const err = new Error(raw || `Gemini HTTP ${res.status}`);
          err.code = res.status; lastError = err; continue;
        }
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let data; try { data = JSON.parse(text); } catch { data = {}; }
        // Assurer la forme minimale attendue
        const analysis = normalizeAnalysis(data?.analysis || data || {});
        return analysis;
      } catch(e){ lastError = e; }
    }
  }
  throw lastError || new Error('Gemini indisponible');
}

function buildPrompt(envSignals){
  return [
    'Tu es un expert dermo-cosmétique et visagiste.',
    'Analyse uniquement l’image fournie (selfie) et renvoie STRICTEMENT un JSON sans texte autour:',
    "{ analysis: { skin_type: 'sec|normal|gras|mixte|sensible', needs: string[], notes: string[], hair: { type: 'raide|ondulé|bouclé|crépu|--', density: 'faible|moyenne|élevée', frizz: number(0..1), shine: number(0..1) } } }",
    'Ne renvoie AUCUNE recommandation produit.',
    'Règles: privilégier hydratation si peau/ambiance sèches, apaisement si rougeurs, éclat si UV élevés.',
    'Environnement: ' + JSON.stringify(envSignals || {}),
  ].join('\n');
}

function normalizeAnalysis(a){
  const hair = a?.hair || {};
  return {
    skin_type: a?.skin_type ?? null,
    needs: Array.isArray(a?.needs) ? a.needs : [],
    notes: Array.isArray(a?.notes) ? a.notes : [],
    hair: {
      type: hair?.type ?? '--',
      density: hair?.density ?? null,
      frizz: typeof hair?.frizz === 'number' ? hair.frizz : null,
      shine: typeof hair?.shine === 'number' ? hair.shine : null,
    },
  };
}
