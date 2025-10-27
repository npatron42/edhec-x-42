// Minimal shim for react-native-fs to satisfy optional require in tfjs-react-native
module.exports = {
  readFile: async () => { throw new Error('react-native-fs not available in Expo'); },
  writeFile: async () => { throw new Error('react-native-fs not available in Expo'); },
  // Add any other APIs if the library attempts to access them
};
