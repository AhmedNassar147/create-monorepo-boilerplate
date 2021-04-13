/*
 *
 * getAppGeneratedPagesRoutesDataPath
 *
 */

function getAppMainRoutesPath() {
  return `${process.cwd()}/app/src/routes`;
}

function getAppGeneratedPagesRoutesDataPath() {
  return `${getAppMainRoutesPath()}/pagesRoutesData.ts`;
}

function getAppGeneratedPagesRoutesPathNames() {
  return `${process.cwd()}/packages/routes/src/pagesPathNames.ts`;
}

module.exports = {
  getAppGeneratedPagesRoutesDataPath,
  getAppGeneratedPagesRoutesPathNames
};
