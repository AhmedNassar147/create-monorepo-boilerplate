/*
 *
 * `routesPaths`: `build-app-routes`.
 *
 */
const getAppPagesRoutesDataPath = (appName) => {
  return `${process.cwd()}/${appName}/src/routes/pagesRoutesData.ts`;
};

const getPathNamesPathInRoutesPackage = () => {
  return `${process.cwd()}/packages/routes/src/pagesPathNames.ts`;
};

const getGeneratedPagesRoutesPathNamesPath = () => {
  return `${process.cwd()}/internals/generateAppsRoutesConfig/generated/pagesPathNames.json`;
};

module.exports = {
  getAppPagesRoutesDataPath,
  getPathNamesPathInRoutesPackage,
  getGeneratedPagesRoutesPathNamesPath,
};
