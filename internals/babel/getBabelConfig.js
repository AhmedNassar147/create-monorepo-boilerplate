/*
 *
 * `getBabelConfig`: `babel`.
 *
 */
const invariant = require("../scripts/invariant");
const geEnvVariables = require("../environment/geEnvVariables");
const getWorksSpacesOnlyNamesSync = require("../workspaces/getWorksSpacesOnlyNamesSync");

const getBabelConfig = (env, useCjsFormat) => {
  let isBabeEslintRunner = typeof env === "object";

  if (isBabeEslintRunner) {
    env.cache.forever();
  }

  const isEnvDevelopment = env === "development" || isBabeEslintRunner;
  const isEnvProduction = env === "production";

  invariant(
    isEnvDevelopment || isEnvProduction,
    "Using `babel-preset` requires that you specify `NODE_ENV` or " +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"packagesBuildEnv", and "production". Instead, received: ' +
      JSON.stringify(env) +
      ".",
  );

  const workspaces = getWorksSpacesOnlyNamesSync();

  const { raw } = geEnvVariables({
    mode: isEnvDevelopment ? "development" : env,
  });

  const isEsModules = !(useCjsFormat || isBabeEslintRunner);

  return {
    // `comments` strips the comments when `false`. We always set it to `true`
    // because we can't remove them, or `babel` would also remove the `webpack`
    // magic comments for dynamic imports (@example
    // `/* webpackChunkName: 'something' */`).
    comments: true,
    overrides: [
      // Like `react-boilerplate`, we run aggressive optimizations only on
      // the code that we can control and when the environment is production.
      // @see {@link https://github.com/react-boilerplate/react-boilerplate/blob/master/babel.config.js#L18}
      isEnvDevelopment
        ? undefined
        : {
            include: workspaces,
            plugins: [
              "transform-react-remove-prop-types",
              "@babel/plugin-transform-react-constant-elements",
              "@babel/plugin-transform-react-inline-elements",
            ],
          },
      {
        plugins: [["transform-define", raw]],
      },
    ].filter(Boolean),
    presets: [
      [
        "@babel/preset-env",
        {
          // @see {@link https://webpack.js.org/guides/tree-shaking/#conclusion}
          // @see {@link https://babeljs.io/docs/en/babel-preset-env#modules}
          modules: false,
          // @see {@link https://babeljs.io/docs/en/babel-preset-env#usebuiltins}
          useBuiltIns: "entry",
          // @see {@link https://babeljs.io/docs/en/next/babel-preset-env.html#corejs}
          // This option only has an effect when used alongside `useBuiltIns:
          // usage` or `useBuiltIns: entry`, and ensures `@babel/preset-env`
          // injects the correct imports for your `core-js` version. This
          // version should be the major version of the `core-js` in the
          // root project's `package.json`.
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ["transform-typeof-symbol"],
        },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
      [
        "@babel/preset-typescript",
        {
          isTSX: true,
          allExtensions: true,
          allowNamespaces: true,
          allowDeclareFields: true,
        },
      ],
      isEnvProduction ? ["minify", { keepFnName: false }] : undefined,
    ].filter(Boolean),
    plugins: [
      [
        // @see {link https://styled-components.com/docs/tooling#usage}
        "styled-components",
        {
          // @see {@link https://www.styled-components.com/docs/api#css-prop}
          cssProp: true,
          ...(!isEnvProduction
            ? {
                // @see {@link https://styled-components.com/docs/tooling#minification}
                minify: false,
                transpileTemplateLiterals: false,
              }
            : {
                displayName: false,
                // @see {@link https://www.styled-components.com/docs/tooling#dead-code-elimination}
                pure: true,
              }),
        },
      ],
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-export-default-from",
      [
        "@babel/plugin-proposal-class-properties",
        {
          loose: true,
        },
      ],
      [
        // @see {@link https://babeljs.io/docs/en/babel-plugin-transform-runtime}
        "@babel/plugin-transform-runtime",
        {
          absoluteRuntime: false,
          version: require("@babel/runtime/package.json").version,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: isEsModules,
        },
      ],
      // isEnvDevelopment && "react-refresh/babel",
    ].filter(Boolean),
  };
};

module.exports = getBabelConfig;
