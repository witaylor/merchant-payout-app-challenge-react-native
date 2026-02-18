module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-ng/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|msw|until-async)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  passWithNoTests: true,
  collectCoverageFrom: [
    "api/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
};
