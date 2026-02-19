const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude test files from the bundle (they pull in msw/node which uses Node's async_hooks)
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : [config.resolver.blockList]),
  /\.test\.(ts|tsx)$/,
].filter(Boolean);

module.exports = config;
