/*
 *
 * `getBabelConfig`: `babel`.
 *
 */
"use strict";
const invariant = require("../scripts/invariant");
const getWorksSpacesOnlyNames = require("../workspaces/getWorksSpacesOnlyNames");

const getBabelConfig = async (env, useCjsFormat) => {
  const isEnvDevelopment = env === "development";
  const isEnvProduction = env === "production";
  const packagesBuildEnv = env === "packagesBuildEnv";

  invariant(
    isEnvDevelopment || isEnvProduction || packagesBuildEnv,
    "Using `babel-preset` requires that you specify `NODE_ENV` or " +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"packagesBuildEnv", and "production". Instead, received: ' +
      JSON.stringify(env) +
      ".",
  );

  const workspaces = await getWorksSpacesOnlyNames();

  const isEsModules = !useCjsFormat;

  return {
    // `upward` is required in monorepos, see the comment above.
    // rootMode: "upward",
    // `comments` strips the comments when `false`. We always set it to `true`
    // because we can't remove them, or `babel` would also remove the `webpack`
    // magic comments for dynamic imports (@example
    // `/* webpackChunkName: 'something' */`).
    comments: true,
    overrides: [
      // Like `react-boilerplate`, we run aggressive optimizations only on
      // the code that we can control and when the environment is production.
      // @see {@link https://github.com/react-boilerplate/react-boilerplate/blob/master/babel.config.js#L18}
      isEnvDevelopment || packagesBuildEnv
        ? undefined
        : {
            include: workspaces,
            plugins: [
              "@babel/plugin-transform-react-constant-elements",
              "@babel/plugin-transform-react-inline-elements",
            ],
          },
    ].filter(Boolean),
    presets: [
      [
        "@babel/preset-env",
        {
          // @see {@link https://webpack.js.org/guides/tree-shaking/#conclusion}
          // @see {@link https://babeljs.io/docs/en/babel-preset-env#modules}
          modules: useCjsFormat ? "cjs" : false,
          // @see {@link https://babeljs.io/docs/en/babel-preset-env#usebuiltins}
          useBuiltIns: "entry",
          // @see {@link https://babeljs.io/docs/en/next/babel-preset-env.html#corejs}
          // This option only has an effect when used alongside `useBuiltIns:
          // usage` or `useBuiltIns: entry`, and ensures `@babel/preset-env`
          // injects the correct imports for your `core-js` version. This
          // version should be the major version of the `core-js` in the
          // root project's `package.json`.
          corejs: 3,
          ...(isEsModules && packagesBuildEnv
            ? { targets: { esmodules: true } }
            : {}),
          // Exclude transforms that make all code slower
          exclude: ["transform-typeof-symbol"],
        },
      ],
      [
        "@babel/preset-react",
        {
          // development: isEnvDevelopment || packagesBuildEnv,
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
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-export-default-from",
      [
        "@babel/plugin-proposal-class-properties",
        {
          loose: true,
        },
      ],
      packagesBuildEnv && [
        // @see {@link https://babeljs.io/docs/en/babel-plugin-transform-runtime}
        "@babel/plugin-transform-runtime",
        {
          version: require("@babel/runtime/package.json").version,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: isEsModules,
          absoluteRuntime: false,
        },
      ],
      // isEnvDevelopment && "react-refresh/babel",
    ].filter(Boolean),
  };
};

module.exports = getBabelConfig;

// "babel-plugin-styled-components": "^1.12.0",
// [
//   // @see {link https://styled-components.com/docs/tooling#usage}
//   'styled-components',
//   {
//     // @see {@link https://www.styled-components.com/docs/api#css-prop}
//     cssProp: true,
//     ...(!isEnvDevelopment
//       ? {
//         // Disable optimizations in development, hopefully it's
//         // faster this way.
//         // @see {@link https://styled-components.com/docs/tooling#minification}
//         minify: false,
//         transpileTemplateLiterals: false,
//         }
//     : {
//         // We disable this option in `PRODUCTION_WWW` to remove React
//         // components display names from the HTML and reduce its size.
//         // @see {@link https://www.styled-components.com/docs/tooling#better-debugging}
//         displayName: false,
//         // @see {@link https://www.styled-components.com/docs/tooling#dead-code-elimination}
//         pure: true,
//     }),
//   },
// ],
