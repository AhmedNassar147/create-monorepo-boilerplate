/*
 *
 * `webpackResolveAlias`: `@domain/webpack`.
 *
 */
const { resolve } = require("path");
const { findRootYarnWorkSpaces } = require("../../scripts");

const resolveAliasPath = (name) =>
  resolve(findRootYarnWorkSpaces(), "node_modules", name);

module.exports = {
  // @see {@link https://github.com/styled-components/styled-components-website/blob/master/sections/faqs/duplicated-styled-components.md#duplicated-module-in-node_modules}
  "styled-components": resolveAliasPath("styled-components"),
  // https://preactjs.com/guide/v10/getting-started/#aliasing-react-to-preact
  react: resolveAliasPath("preact/compat"),
  "react-dom": resolveAliasPath("preact/compat"),
  typescript: resolveAliasPath("typescript"),
  "react-router-dom": resolveAliasPath("react-router-dom"),
  // "react-redux": resolveAliasPath("react-redux"),
  // "redux-saga": resolveAliasPath("redux-saga"),
  // redux: resolveAliasPath("redux"),
  // antd: resolveAliasPath("antd/es"),
  // moment$: resolveAliasPath("moment/moment.js"),
};
