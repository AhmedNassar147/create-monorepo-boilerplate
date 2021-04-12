/*
 * generators
 * Exports the generators so that `plop` knows them.
 */
const appGenerator = require("./app");
const defineAppActionAfterCreation = require("./app/defineAppActionAfterCreation");

module.exports = (plop) => {
  // generators
  plop.setGenerator("scaffolding app", appGenerator);

  defineAppActionAfterCreation(plop);
};
