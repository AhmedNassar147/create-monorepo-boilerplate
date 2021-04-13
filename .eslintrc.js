// https://www.npmjs.com/package/eslint-config-react-app
// https://github.com/facebook/create-react-app/blob/master/packages/eslint-config-react-app/index.js
// https://medium.com/@dors718/linting-your-react-typescript-project-with-eslint-and-prettier-2423170c3d42
module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    // project: path.resolve(__dirname, "./tsconfig.json"),
    // tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": {
      "ts-expect-error": true,
      "ts-ignore": "allow-with-description",
      "ts-nocheck": true,
      "ts-check": false,
      minimumDescriptionLength: 3,
    },
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/require-render-return": "off",
    "react/no-deprecated": "off",
    "react/no-string-refs": "off",
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 1,
    "react/no-danger": 2,
    "react/jsx-filename-extension": [
      "warn",
      {
        extensions: [".jsx", ".tsx", ".js"],
      },
    ],
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
