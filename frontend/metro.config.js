const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .txt files
config.resolver.assetExts.push("txt");

// Force 'three' to resolve to the single installed version
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "three") {
    return context.resolveRequest(
      context,
      require.resolve("three"),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
