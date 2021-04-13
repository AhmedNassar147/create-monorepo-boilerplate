/*
 * generators
 * Exports the generators so that `plop` knows them.
 */
const appGenerator = require("./app");
const defineAppActionAfterCreation = require("./app/defineAppActionAfterCreation");
const reactPackageGenerator = require("./react-package");
const definePlopActionsAfterPackageCreation = require("./react-package/utils/definePlopActionsAfterPackageCreation");
const defineReactComponentPlopHelpers = require("./react-package/utils/defineReactComponentPlopHelpers");

module.exports = (plop) => {
  // generators
  plop.setGenerator("scaffolding app", appGenerator);
  plop.setGenerator("scaffolding react package", reactPackageGenerator);

  defineAppActionAfterCreation(plop);
  definePlopActionsAfterPackageCreation(plop);
  defineReactComponentPlopHelpers(plop);
};
