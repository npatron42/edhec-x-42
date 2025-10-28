// Charge les variables d’environnement depuis .env (dev local)
require('dotenv').config();

// Injecte les variables d’environnement dans expo.extra sans commiter de secret
// Utilisation: GEMINI_API_KEY=... OPENAI_API_KEY=... npx eas-cli update --channel production

module.exports = ({ config }) => ({
  ...config,
  owner: config.owner || process.env.EXPO_OWNER || undefined,
  extra: {
    ...(config.extra || {}),
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
});
