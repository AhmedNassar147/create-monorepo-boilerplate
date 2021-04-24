/*
 *
 * `tsLinter`: `eslint`.
 *
 */
const baseOptions = require("./constants");

const { extendsPlugins, rules } = baseOptions;

module.exports = {
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
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    extendsPlugins.prettier,
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
  rules: {
    ...rules,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "default-case": "off",
    "no-dupe-class-members": "off",
    "no-undef": "off",
    "@typescript-eslint/consistent-type-assertions": "warn",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "warn",
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": "warn",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "warn",
      {
        functions: false,
        classes: false,
        variables: false,
        typedefs: false,
      },
    ],

    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "warn",

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
    "react/style-prop-object": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-typos": "error",
    "react/jsx-filename-extension": [
      "warn",
      {
        extensions: [".jsx", ".tsx", ".js"],
      },
    ],
  },
};
