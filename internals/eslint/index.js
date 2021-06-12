/*
 *
 * Index: `eslint`.
 *
 */
const { extendsPlugins, rules } = require("./constants");
const tsLinter = require("./tsLinter");

module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script",
    babelOptions: {
      configFile: "./internals/babel/getBabelConfig.js",
    },
  },
  extends: [...Object.values(extendsPlugins)],
  plugins: ["import"],
  rules: rules,
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [tsLinter],
};
