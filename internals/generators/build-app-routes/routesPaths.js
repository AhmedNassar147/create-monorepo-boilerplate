/*
 *
 * `routesPaths`: `build-app-routes`.
 *
 */
const getAppGeneratedPagesRoutesDataPath = (appName) => {
  return `${process.cwd()}/${appName}/src/routes/pagesRoutesData.ts`;
};

const getPagesRoutesPathNamesPath = () => {
  return `${process.cwd()}/packages/routes/src/pagesPathNames.json`;
};

module.exports = {
  getAppGeneratedPagesRoutesDataPath,
  getPagesRoutesPathNamesPath,
};
