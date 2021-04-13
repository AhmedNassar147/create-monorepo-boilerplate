/*
 *
 * `definePlopActionsAfterPackageCreation`: `utils`.
 *
 */
const path = require("path");
const getTypeOfComponentPackage = require("./getTypeOfComponentPackage");
const isReactComponentSelected = require("./isReactComponentSelected");
const definePlopActionAndExecuteScript = require("../../utils/definePlopActionAndExecuteScript");
const { PROJECT_NAME_SPACE } = require("../../../constants/base");

function definePlopActionsAfterPackageCreation(plop) {
  // create plop action to prettify the new created package.
  definePlopActionAndExecuteScript(
    plop,
    "prettify",
    ({ name, containingFolderPath }, { data }) => {
      const folderPath = path.resolve(
        process.cwd(),
        data.containingFolderPath || containingFolderPath,
        name,
        "**",
      );

      return `yarn prettify "${folderPath}"`;
    },
  );

  // update generated routes when the generated page id
  definePlopActionAndExecuteScript(
    plop,
    "update-generated-routes",
    ({ type }) => {
      const { isPage } = getTypeOfComponentPackage(type);

      if (isPage) {
        return `yarn "generate-routes"`;
      }

      return undefined;
    },
  );

  // update `app/package.json` and working directory `package.json`.
  // with the new package dynamically then we install them.
  definePlopActionAndExecuteScript(
    plop,
    "update-workspaces-deps",
    (answers) => {
      const isReactPackage = isReactComponentSelected(answers);

      if (isReactPackage) {
        const { name } = answers;
        const newPackageNameAndVersion = `${PROJECT_NAME_SPACE}/${name}@1.0.0`;

        return [
          // we use yarn workspaces to manage the root deps it's easier
          // than lerna at this situation.
          `yarn add ${newPackageNameAndVersion} -W`,

          // install dependencies after package has been generated.
          "yarn bootstrap",
        ];
      }

      return undefined;
    },
  );
}

module.exports = definePlopActionsAfterPackageCreation;
