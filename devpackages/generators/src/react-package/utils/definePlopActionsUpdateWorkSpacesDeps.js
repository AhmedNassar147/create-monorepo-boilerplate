/*
 *
 * `definePlopActionsUpdateWorkSpacesDeps`: `utils`.
 *
 */
const isReactComponentSelected = require("./isReactComponentSelected");
const definePlopActionAndExecuteScript = require("../../utils/definePlopActionAndExecuteScript");
const { toPackageNameWithScope } = require("../../../../scripts");

function definePlopActionsUpdateWorkSpacesDeps(plop) {
  // update `app/package.json` and working directory `package.json`.
  // with the new package dynamically then we install them.
  definePlopActionAndExecuteScript(
    plop,
    "update-workspaces-deps",
    (answers) => {
      const isReactPackage = isReactComponentSelected(answers);

      if (isReactPackage) {
        const { name, folderOrFileName } = answers;
        const packageName = toPackageNameWithScope(folderOrFileName || name);
        const newPackageNameAndVersion = `${packageName}@1.0.0`;

        return [
          // we use yarn workspaces to manage the root deps it's easier
          // than lerna at this situation.
          `yarn add "${newPackageNameAndVersion}" -W`,
          `yarn bootstrap:packages`,
        ];
      }

      return undefined;
    },
  );
}

module.exports = definePlopActionsUpdateWorkSpacesDeps;
