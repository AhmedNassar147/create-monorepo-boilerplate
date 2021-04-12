/*
 *
 * defineActionAfterCreation: `app`.
 *
 */
const { writeFile } = require("fs");
const path = require("path");
const definePlopActionAndExecuteScript = require("../utils/definePlopActionAndExecuteScript");
const readJsonFileSync = require("../../scripts/readJsonFileSync");
const getRootPackageJsonSync = require("../../scripts/getRootPackageJsonSync");

function definePlopActionsAfterPackageCreation(plop) {
  // create plop action to prettify the new created app.
  definePlopActionAndExecuteScript(plop, "prettify-app", (answers) => {
    const folderPath = path.resolve(process.cwd(), `${answers.name}-app`, "**");

    return `yarn prettify "${folderPath}"`;
  });

  // update the very root `package.json` and `lerna.json` workspaces.
  definePlopActionAndExecuteScript(
    plop,
    "update-yarn-lerna-root-workspaces",
    ({ name }) => {
      const lernaJsonPath = path.join(process.cwd(), "lerna.json");
      const rootPackageJsonPath = path.join(process.cwd(), "package.json");

      const rootPackageJson = getRootPackageJsonSync();
      const lernaJson = readJsonFileSync(lernaJsonPath, true);

      const realName = `${name}-app`;

      [
        [lernaJsonPath, "packages", lernaJson],
        [rootPackageJsonPath, "workspaces", rootPackageJson],
      ].forEach(([filePath, propName, fileData]) => {
        fileData[propName] = [...fileData[propName], realName];

        writeFile(
          filePath,
          JSON.stringify(fileData, null, 2),
          { encoding: "utf8" },
          (error) => {
            if (error) {
              console.log(
                `[error] happened when writing ${filePath} data after creating app`,
                error,
              );
            }
          },
        );
      });

      return undefined;
    },
  );
}

module.exports = definePlopActionsAfterPackageCreation;
