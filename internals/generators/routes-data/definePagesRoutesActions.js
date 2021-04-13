/*
 *
 * definePagesRoutesActions
 *
 */
const path = require("path");
const collectPagesFromPackages = require("./collectPagesFromPackages");
const definePlopActionAndExecuteScript = require("../utils/definePlopActionAndExecuteScript");
const {
  getAppGeneratedPagesRoutesDataPath,
  getAppGeneratedPagesRoutesPathNames
} = require("./getAppGeneratedPagesRoutesDataPath");

function definePagesRoutesActions(plop) {
  definePlopActionAndExecuteScript(
    plop,
    "collect-pages-data-from-packages",
    () => {
      collectPagesFromPackages();
      return undefined;
    }
  );

  definePlopActionAndExecuteScript(
    plop,
    "prettify-generated-app-routes",
    () => {
      const routeDataFilePath = path.resolve(
        getAppGeneratedPagesRoutesDataPath()
      );
      const routeDataPathNames = path.resolve(
        getAppGeneratedPagesRoutesPathNames()
      );

      return [
        `yarn prettify "${routeDataPathNames}"`,
        `yarn prettify "${routeDataFilePath}"`
      ];
    }
  );
}

module.exports = definePagesRoutesActions;
