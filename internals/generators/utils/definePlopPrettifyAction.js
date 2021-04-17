/*
 *
 * `definePlopPrettifyAction`: `utils`.
 *
 */
const path = require("path");
const definePlopActionAndExecuteScript = require("./definePlopActionAndExecuteScript");

function definePlopPrettifyAction(plop) {
  // create plop action to prettify the created package/app.
  definePlopActionAndExecuteScript(
    plop,
    "prettify",
    ({ name, containingFolderPath, folderOrFileName, noGlob }) => {
      const cwd = process.cwd();
      const segments = [];

      if (
        !containingFolderPath ||
        (containingFolderPath && !containingFolderPath.includes(cwd))
      ) {
        segments.push(cwd);
      }

      if (containingFolderPath) {
        segments.push(containingFolderPath);
      }

      segments.push(folderOrFileName || name);

      if (!noGlob) {
        segments.push("**");
      }

      const folderPath = path.resolve(...segments);

      return `yarn prettify "${folderPath}"`;
    },
  );
}

module.exports = definePlopPrettifyAction;
