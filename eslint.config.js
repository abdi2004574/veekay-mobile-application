const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    ignores: ["dist/*", "e2e/**", "playwright-report/**", "test-results/**"],
  },
];
