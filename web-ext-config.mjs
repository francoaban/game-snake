// Configuración de web-ext (lint, run y build).
// Solo se empaqueta lo que la extensión necesita en tiempo de ejecución.
export default {
  sourceDir: ".",
  artifactsDir: "web-ext-artifacts",
  ignoreFiles: [
    ".github",
    "docs",
    "test",
    "node_modules",
    "web-ext-artifacts",
    "package.json",
    "package-lock.json",
    "eslint.config.js",
    "web-ext-config.mjs",
    ".prettierrc.json",
    ".prettierignore",
    ".editorconfig",
    ".gitignore",
    "icons/icon.svg",
    "*.md"
  ],
  build: {
    overwriteDest: true
  }
};
