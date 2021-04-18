/*
 *
 * `definePlopActionsUpdateWorkSpacesDeps`: `utils`.
 *
 */
const isReactComponentSelected = require("./isReactComponentSelected");
const definePlopActionAndExecuteScript = require("../../utils/definePlopActionAndExecuteScript");
const { PROJECT_NAME_SPACE } = require("../../../constants/base");

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
        const packageName = `${PROJECT_NAME_SPACE}/${folderOrFileName || name}`;
        const newPackageNameAndVersion = `${packageName}@1.0.0`;

        process.env.SKIP_POST_INSTALL = "true";

        return [
          // we use yarn workspaces to manage the root deps it's easier
          // than lerna at this situation.
          `yarn add "${newPackageNameAndVersion}" -W`,
          `yarn bootstrap`,
        ];
      }

      return undefined;
    },
  );
}

module.exports = definePlopActionsUpdateWorkSpacesDeps;
