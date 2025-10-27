// Envoi du selfie + contexte à OpenAI (Vision) pour une analyse et recommandations.
// Prend: base64 (jpeg), envSignals (uv, pm2_5, etc.), produits
// Retour: { analysis: {...}, recommendations: Product[], rationale: string }
import { getOpenAIKey } from '../env/config';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function analyzeWithChatGPT({ base64, envSignals, products }){
  const apiKey = getOpenAIKey();
  const keyMasked = apiKey ? `${apiKey.slice(0,7)}…${apiKey.slice(-4)}` : '—';
  if (!apiKey) {
    console.warn('[AI] OPENAI_API_KEY manquant');
    const err = new Error('OPENAI_API_KEY manquant.');
    err.code = 401;
    throw err;
  }

  const prompt = buildSystemPrompt();
  const user = buildUserMessage({ base64, envSignals, products });

  // Logs de debug
  try {
    console.log('[AI] Préparation appel IA', {
      url: OPENAI_URL,
      model: 'gpt-4o-mini',
      keyMasked,
      base64Length: base64?.length || 0,
      catalogSize: Array.isArray(products) ? products.length : 0,
      env: {
        uv_index: envSignals?.uv_index,
        humidity: envSignals?.humidity,
        pm2_5: envSignals?.pm2_5,
      },
    });
  } catch {}

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [prompt, user],
    }),
  });

  if (!res.ok) {
    let raw = '';
    try { raw = await res.text(); } catch {}
    const bodyPreview = (raw || '').slice(0, 500);
    console.error('[AI] OpenAI HTTP error', { status: res.status, bodyPreview });
    let message = bodyPreview;
    try { const parsed = JSON.parse(raw); message = parsed?.error?.message || message; } catch {}
    const err = new Error(message || `OpenAI HTTP ${res.status}`);
    err.code = res.status;
    err.bodyPreview = bodyPreview;
    throw err;
  }
  let json;
  try { json = await res.json(); } catch (e) {
    console.error('[AI] Échec du parsing JSON OpenAI', e);
    const err = new Error('Réponse IA invalide');
    err.code = 500;
    throw err;
  }
  const txt = json?.choices?.[0]?.message?.content || '{}';
  let data;
  try { data = JSON.parse(txt); } catch (e) {
    console.error('[AI] Contenu non JSON dans message.content', txt?.slice(0,200));
    data = {};
  }

  // Normaliser recommandations: map vers attributs du catalogue
  const recs = Array.isArray(data.recommendations) ? data.recommendations.map((r) => {
    const rid = r?.id != null ? String(r.id) : null;
    const rname = r?.name ? String(r.name).toLowerCase() : null;
    const rcat = r?.category ? String(r.category) : null;
    let match = rid ? products.find(p => String(p.id) === rid) : null;
    if (!match && rname) {
      match = products.find(p => String(p.name || '').toLowerCase() === rname);
    }
    if (!match && rcat) {
      match = products.find(p => p.category === rcat);
    }
    return match || null;
  }).filter(Boolean) : [];

  try {
    console.log('[AI] Réponse IA OK', {
      analysisKeys: Object.keys(data?.analysis || {}),
      recsCount: recs.length,
      rationaleLen: (data?.rationale || '').length,
    });
  } catch {}

  return {
    analysis: data.analysis || {},
    rationale: typeof data.rationale === 'string' ? data.rationale : '',
    recommendations: recs.length ? recs : products.slice(0,3),
  };
}

function buildSystemPrompt(){
  return {
    role: 'system',
    content: `Tu es un expert dermo-cosmétique et visagiste. Tu reçois: 1) un selfie, 2) des signaux environnement (UV, pollution, humidité...), 3) un catalogue de produits Vaseline. Objectif: produire un JSON concis et actionnable (pas de texte libre) avec:\n- analysis: { skin_type: 'sec|normal|gras|mixte|sensible', needs: string[], notes: string[] }\n- recommendations: ProductRef[] (identifiants du catalogue en entrée), max 3 items, triés par pertinence\n- rationale: une explication brève (3 lignes max)\nPrivilégie l'hydratation si peau/ambiance sèches, l'apaisement si rougeurs, l'éclat si UV élevés. Respecte rigoureusement le format JSON.`
  };
}

function buildUserMessage({ base64, envSignals, products }){
  const catalog = products.map(p => ({ id: p.id, name: p.name, category: p.category, benefits: p.benefits }));
  const textPart = {
    type: 'text',
    text: JSON.stringify({ env: envSignals || {}, catalog }, null, 2),
  };
  const imgPart = {
    type: 'image_url',
    image_url: { url: `data:image/jpeg;base64,${base64}` },
  };
  return {
    role: 'user',
    content: [textPart, imgPart],
  };
}
