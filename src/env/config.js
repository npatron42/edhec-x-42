import Constants from 'expo-constants';

export function getOpenAIKey(){
  // Priorité à extra (Expo), fallback env (web/dev)
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
  return extra.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
}

export function getGeminiKey(){
  const extra = Constants?.expoConfig?.extra || Constants?.manifest?.extra || {};
  return extra.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
}
