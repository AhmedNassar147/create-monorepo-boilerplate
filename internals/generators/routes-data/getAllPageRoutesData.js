/*
 *
 * `getAllPageRoutesData`: `@app-structure/generators`.
 *
 */
const { readJsonFile } = require("@app-structure/workspaces-helpers");
const getPathOfGeneratedRoutesFile = require("./getPathOfGeneratedRoutesFile");
const APP_PAGES_DATA = require("./old-app-data");
const processPath = require("./processPath");

function getAllPageRoutesData() {
  const generatedPagesRoutesData = readJsonFile(
    getPathOfGeneratedRoutesFile(),
    true
  );

  const allPagesData = [...generatedPagesRoutesData, ...APP_PAGES_DATA];

  return allPagesData.map(({ path, params, pageIndexPath }) => {
    const isPathArray = Array.isArray(path);
    let pageName = path;

    if (isPathArray) {
      const isLoginPage = /login/.test(path.toString());
      pageName = path[isLoginPage ? 1 : 0];
    }

    return {
      path: processPath(path, params),
      pageIndexPath,
      pageName: pageName.replace(/\//g, "")
    };
  });
}

module.exports = getAllPageRoutesData;
