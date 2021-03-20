/*
 *
 * `webpackResolveAlias`: `webpack`.
 *
 */
const path = require("path");
const getProjectRootDirectoryPath = require("../scripts/getProjectRootDirectoryPath");

const resolveAliasPath = (name) =>
  path.resolve(getProjectRootDirectoryPath(), "node_modules", name);

module.exports = {
  // @see {@link https://github.com/styled-components/styled-components-website/blob/master/sections/faqs/duplicated-styled-components.md#duplicated-module-in-node_modules}
  // "styled-components": resolveAliasPath("styled-components"),
  react: resolveAliasPath("react"),
  "react-dom": resolveAliasPath("react-dom"),
  typescript: resolveAliasPath("typescript"),
  // "react-router-dom": resolveAliasPath("react-router-dom"),
  // "react-redux": resolveAliasPath("react-redux"),
  // "redux-saga": resolveAliasPath("redux-saga"),
  // redux: resolveAliasPath("redux"),
  // antd: resolveAliasPath("antd/es"),
  // moment$: resolveAliasPath("moment/moment.js"),
};
