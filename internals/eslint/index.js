/*
 *
 * Index: `eslint`.
 *
 */
const baseOptions = require("./constants");

const { extendsPlugins, rules } = baseOptions;

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
  extends: Object.values(extendsPlugins),
  rules: {
    ...rules,
    "no-unused-vars": [
      "error",
      { vars: "all", args: "after-used", ignoreRestSiblings: false },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: [
        "app/**/*.{tsx,ts,js}",
        "*-app/**/*.{tsx,ts,js}",
        "packages/**/*.{js,ts,tsx}",
        "*-module/**/*.{js,ts,tsx}",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2018,
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        extendsPlugins.esLinter,
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        extendsPlugins.prettier,
      ],
      plugins: ["@typescript-eslint", "react", "react-hooks"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": 1,
        "@typescript-eslint/ban-ts-comment": [
          "error",
          {
            "ts-ignore": "allow-with-description",
            minimumDescriptionLength: 10,
          },
        ],
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/require-render-return": "off",
        "react/no-deprecated": "error",
        "react/no-string-refs": "off",
        "react/prop-types": "off",
        "react/jsx-fragments": 2,
        "react/jsx-key": 2,
        "react-hooks/rules-of-hooks": 2,
        "react-hooks/exhaustive-deps": 1,
        "react/no-danger": 2,
        "react/jsx-filename-extension": [
          "warn",
          {
            extensions: [".jsx", ".tsx", ".js"],
          },
        ],
        ...rules,
      },
    },
  ],
};
