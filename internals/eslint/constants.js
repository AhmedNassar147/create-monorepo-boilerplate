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
    "no-eval": 1,
    "no-implied-eval": 1,
    "no-use-before-define": 2,
    "no-debugger": 2,
    "no-var": 2,
    "no-empty": 2,
    // "no-console": process.env.NODE_ENV === "production" ? 2 : "off",
  },
};
