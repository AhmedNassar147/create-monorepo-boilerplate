/*
 *
 * `Constants`: `eslint`.
 *
 */
module.exports = {
  extendsPlugins: {
    esLinter: "eslint:recommended",
    prettier: "plugin:prettier/recommended",
  },
  rules: {
    "no-eval": "warn",
    "no-implied-eval": "warn",
    "no-debugger": "warn",
    "no-var": "warn",
    "no-empty": "warn",
    "no-unreachable": "warn",
    "no-unused-expressions": [
      "error",
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    "no-unused-labels": "warn",
    "no-unused-vars": [
      "warn",
      { vars: "all", args: "after-used", ignoreRestSiblings: false },
    ],
    "no-use-before-define": [
      "warn",
      {
        functions: false,
        classes: false,
        variables: false,
      },
    ],
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-constructor": "warn",
    "no-useless-escape": "warn",
    "no-useless-rename": [
      "warn",
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    "no-with": "warn",
    "no-whitespace-before-property": "warn",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        groups: [
          "builtin",
          "external",
          "index",
          "internal",
          "sibling",
          "parent",
          "object",
        ],
      },
    ],
    "import/no-duplicates": "error",
    // "import/no-unused-modules": [1, { unusedExports: true }],
    // "no-console": process.env.NODE_ENV === "production" ? 2 : "off",
  },
  appAndPackagesFiles: [
    "app/**/*.{tsx,ts,js}",
    "*-app/**/*.{tsx,ts,js}",
    "packages/**/*.{js,ts,tsx}",
    "*-module/**/*.{js,ts,tsx}",
    "typings/*.d.ts",
  ],
};
