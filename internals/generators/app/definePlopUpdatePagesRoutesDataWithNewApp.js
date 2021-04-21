/*
 *
 * `definePlopUpdatePagesRoutesDataWithNewApp`: `app`.
 *
 */
const definePlopActionAndExecuteScript = require("../utils/definePlopActionAndExecuteScript");
const updateJsonFileSync = require("../../scripts/updateJsonFileSync");
const invariant = require("../../scripts/invariant");

function definePlopUpdatePagesRoutesDataWithNewApp(plop) {
  definePlopActionAndExecuteScript(
    plop,
    "update-pages-routes-data-with-app",
    ({ selectedPages, name }) => {
      const appName = `${name}-app`;

      selectedPages.forEach((basePackagePath) => {
        const jsonFilePath = `${basePackagePath}/package.json`;
        updateJsonFileSync(
          jsonFilePath,
          (data) => {
            const routeData = data.routeData;

            invariant(
              !!routeData,
              `found a page with no \`routeData\` configured` +
                `see ${jsonFilePath}.`,
            );

            return {
              ...data,
              routeData: {
                ...routeData,
                apps: [...(routeData.apps || []), appName],
              },
            };
          },
          true,
        );
      });

      return undefined;
    },
  );
}

module.exports = definePlopUpdatePagesRoutesDataWithNewApp;
