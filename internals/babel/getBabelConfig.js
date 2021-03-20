/*
 *
 * `getBabelConfig`: `babel`.
 *
 */
// const { existsSync } = require('fs');
const invariant = require("../scripts/invariant");
const getRootPackageJson = require("../scripts/getRootPackageJson");
const getProperWorkSpaceName = require("../scripts/getProperWorkSpaceName");
// const getProjectRootDirectoryPath = require('../scripts/getProjectRootDirectoryPath');

const getBabelConfig = (env) => {
  const isEnvDevelopment = env === "development";
  const isEnvProduction = env === "production";

  invariant(
    isEnvDevelopment || isEnvProduction,
    "Using `babel-preset` requires that you specify `NODE_ENV` or " +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(env) +
      ".",
  );

  // const absoluteRuntimePath = `${getProjectRootDirectoryPath()}/node_modules/@babel/runtime/package.json`

  // invariant(
  //   !existsSync(absoluteRuntimePath),
  //   'Using `babel-preset` requires to find the `absoluteRuntimePath` given:' +
  //   `absoluteRuntimePath=${absoluteRuntimePath} but couldn\'t be found.`
  // );

  const { workspaces } = getRootPackageJson();

  // console.log("workspaces", workspaces, typeof workspaces);

  return {
    // `upward` is required in monorepos, see the comment above.
    // rootMode: "upward",
    // babelrcRoots: [
    //   // Also consider monorepo packages "root" and load their .babelrc.json files.
    //   "./packages/*",
    // ],
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
            include: workspaces.map(getProperWorkSpaceName),
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
          modules: "auto",
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
          development: isEnvDevelopment,
          runtime: "automatic",
        },
      ],
      "@babel/preset-typescript",
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
      [
        // @see {@link https://babeljs.io/docs/en/babel-plugin-transform-runtime}
        "@babel/plugin-transform-runtime",
        {
          version: require("@babel/runtime/package.json").version,
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: true,
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
