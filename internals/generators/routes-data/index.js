/*
 *
 * routes data generator: `@app-structure/generators`.
 *
 */

const definePagesRoutesHelpers = require("./definePagesRoutesHelpers");
const definePagesRoutesActions = require("./definePagesRoutesActions");
const {
  getAppGeneratedPagesRoutesDataPath,
  getAppGeneratedPagesRoutesPathNames,
} = require("./getAppGeneratedPagesRoutesDataPath");
const DEVELOPMENT_ONLY_PAGES = require("./developmentOnlyPages");

module.exports = (plop) => {
  plop.setGenerator("routes generator", {
    description: "generate App routes data file",
    prompts: [],
    actions: [
      {
        type: "collect-pages-data-from-packages",
        abortOnFail: true,
      },
      {
        type: "add",
        path: `${getAppGeneratedPagesRoutesPathNames()}`,
        templateFile: "./pathnames.js.hbs",
        abortOnFail: true,
        force: true,
        data: {
          initPagesData: true,
        },
      },
      {
        type: "add",
        path: `${getAppGeneratedPagesRoutesDataPath()}`,
        templateFile: "./index.js.hbs",
        abortOnFail: true,
        force: true,
        data: {
          initPagesData: true,
          DEVELOPMENT_ONLY_PAGES,
        },
      },
      {
        type: "prettify-generated-app-routes",
      },
    ],
  });

  definePagesRoutesHelpers(plop);

  definePagesRoutesActions(plop);
};
