/*
 * generators
 * Exports the generators so that `plop` knows them.
 */
const appGenerator = require("./app");
const definePlopUpdatePagesRoutesDataWithNewApp = require("./app/definePlopUpdatePagesRoutesDataWithNewApp");
const reactPackageGenerator = require("./react-package");
const definePlopActionsUpdateWorkSpacesDeps = require("./react-package/utils/definePlopActionsUpdateWorkSpacesDeps");
const defineReactComponentPlopHelpers = require("./react-package/utils/defineReactComponentPlopHelpers");
const definePageRouteRouteData = require("./react-package/utils/definePageRouteRouteData");
const defineUpdateWorkSpacesRoots = require("./utils/defineUpdateWorkSpacesRoots");
const definePlopPrettifyAction = require("./utils/definePlopPrettifyAction");
const definePlopActionUpdateGeneratedRoutes = require("./utils/definePlopActionUpdateGeneratedRoutes");
const definePlopOrHelper = require("./utils/definePlopOrHelper");

module.exports = (plop) => {
  // generators
  plop.setGenerator("Scaffolding Package", reactPackageGenerator);
  plop.setGenerator("Scaffolding App", appGenerator);

  defineReactComponentPlopHelpers(plop);
  definePlopActionsUpdateWorkSpacesDeps(plop);
  definePlopPrettifyAction(plop);
  defineUpdateWorkSpacesRoots(plop);
  definePageRouteRouteData(plop);
  definePlopUpdatePagesRoutesDataWithNewApp(plop);
  definePlopActionUpdateGeneratedRoutes(plop);
  definePlopOrHelper(plop);
};
