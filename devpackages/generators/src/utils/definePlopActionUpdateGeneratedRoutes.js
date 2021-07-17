/*
 *
 * `definePlopActionUpdateGeneratedRoutes`: `utils`.
 *
 */
const definePlopActionAndExecuteScript = require("./definePlopActionAndExecuteScript");

function definePlopActionUpdateGeneratedRoutes(plop) {
  definePlopActionAndExecuteScript(
    plop,
    "update-generated-routes",
    ({ apps }) => {
      if (apps && apps.length) {
        return apps.map((appName) => {
          return `yarn "generate-routes" --app=${appName}`;
        });
      }

      return undefined;
    },
  );
}
module.exports = definePlopActionUpdateGeneratedRoutes;
