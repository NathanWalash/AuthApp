// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// allow Metro to resolve Firebase's .cjs modules
defaultConfig.resolver.sourceExts.push('cjs');

// turn off the new package‐exports resolver so Auth can register itself
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
