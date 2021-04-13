/*
 *
 * `collectPagesFromPackages`: `@app-structure/generators`.
 *
 */
const {
  getWorkSpacesPackageJson,
  updateJsonFile
} = require("@app-structure/workspaces-helpers");
const getPathOfGeneratedRoutesFile = require("./getPathOfGeneratedRoutesFile");

function collectPagesFromPackages() {
  const worksSpacesPackageJson = getWorkSpacesPackageJson();
  let pagesDataFromPackages = [];

  const generatedFilePath = getPathOfGeneratedRoutesFile();

  worksSpacesPackageJson.forEach(pkgJson => {
    const { enableBabelTranspilation, routeData, name } = JSON.parse(pkgJson);

    if (enableBabelTranspilation && routeData) {
      if (!routeData.path) {
        throw new Error(`
          Package ${name} should has \`path\` as
          \`string | string[]\` inside  \`routeData\`.
        `);
      }

      const { path, params } = routeData;

      pagesDataFromPackages = pagesDataFromPackages.concat({
        path,
        pageIndexPath: name,
        params
      });
    }
  });

  updateJsonFile(generatedFilePath, pagesDataFromPackages);

  return pagesDataFromPackages;
}

module.exports = collectPagesFromPackages;
