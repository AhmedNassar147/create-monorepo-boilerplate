/*
 *
 * `routesPaths`: `build-app-routes`.
 *
 */
const { findRootYarnWorkSpaces } = require("../../../scripts");

const getAppPagesRoutesDataPath = (appName) => {
  return `${findRootYarnWorkSpaces()}/${appName}/src/pagesRoutesData.ts`;
};

const getPathNamesPathInRoutesPackage = () => {
  return `${findRootYarnWorkSpaces()}/packages/routes/src/pagesPathNames.ts`;
};

module.exports = {
  getAppPagesRoutesDataPath,
  getPathNamesPathInRoutesPackage,
};
