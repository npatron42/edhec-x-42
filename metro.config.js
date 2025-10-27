// Expo Metro config with alias to shim optional native deps
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Shim optional native modules referenced by tfjs-react-native (not available in Expo Go)
config.resolver = config.resolver || {};
config.resolver.extraNodeModules = Object.assign({}, config.resolver.extraNodeModules, {
  'react-native-fs': path.resolve(__dirname, 'shims/react-native-fs.js'),
});

module.exports = config;
