/*
 *
 * `defineUpdateWorkSpacesRoots`: `utils`.
 *
 */
const { writeFileSync } = require("fs");
const path = require("path");
const definePlopActionAndExecuteScript = require("./definePlopActionAndExecuteScript");
const {
  readJsonFileSync,
  getRootPackageJsonSync,
  invariant,
} = require("../../../scripts");

function defineUpdateWorkSpacesRoots(plop) {
  // update the very root `package.json` and `lerna.json` workspaces.
  definePlopActionAndExecuteScript(
    plop,
    "update-yarn-lerna-root-workspaces",
    ({ workspaceName }) => {
      invariant(
        !!workspaceName,
        `\`(update-yarn-lerna-root-workspaces)\`: workspaceName must be provided.`,
      );
      const lernaJsonPath = path.join(process.cwd(), "lerna.json");
      const rootPackageJsonPath = path.join(process.cwd(), "package.json");

      const rootPackageJson = getRootPackageJsonSync();
      const lernaJson = readJsonFileSync(lernaJsonPath, true);

      [
        [lernaJsonPath, "packages", lernaJson],
        [rootPackageJsonPath, "workspaces", rootPackageJson],
      ].forEach(([filePath, propName, fileData]) => {
        fileData[propName] = [...fileData[propName], workspaceName];

        writeFileSync(
          filePath,
          JSON.stringify(fileData),
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

      return `yarn prettify "${process.cwd()}/*.json"`;
    },
  );
}

module.exports = defineUpdateWorkSpacesRoots;
