import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/", "web-ext-artifacts/", "dist/", "coverage/"]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.webextensions
      }
    },
    rules: {
      eqeqeq: "error",
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "no-var": "error",
      "prefer-const": "error"
    }
  },
  {
    files: ["test/**/*.js", "eslint.config.js", "web-ext-config.mjs"],
    languageOptions: {
      globals: globals.node
    }
  }
];
