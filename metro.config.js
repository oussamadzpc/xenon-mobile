const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix Hermes dynamic import issues
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: false,
  compress: false,
};

config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

module.exports = config;