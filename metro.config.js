const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// support extra extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "mjs",
  "cjs",
];

// Hard block Node-only modules used by ws
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "ws" ||
    moduleName === "stream" ||
    moduleName === "zlib" ||
    moduleName === "bufferutil" ||
    moduleName === "utf-8-validate"
  ) {
    return {
      type: "empty",
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;