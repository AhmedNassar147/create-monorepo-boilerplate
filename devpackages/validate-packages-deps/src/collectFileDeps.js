/*
 *
 * `collectFileDeps`: `@domain/validate-packages-deps`
 *
 */
const { readFile } = require("fs/promises");
const chalk = require("chalk");
const {
  scriptName,
  charsAndImportsRegex,
  allImportsRegexp,
  removeComments,
  removeWebpackCommentsRegex,
  removeLineBreaksAndSpaces,
} = require("./constants");
const findRootYarnWorkSpaces = require("../../../internals/workspaces/findRootYarnWorkSpaces");

const collectFileDeps = async (filePath, noLogs) => {
  const rootWorkSpaces = findRootYarnWorkSpaces();

  const logFileName = filePath.replace(`${rootWorkSpaces}/`, "");
  if (!noLogs) {
    console.log(chalk.magenta(`[${scriptName}]: processing ${logFileName}`));
  }

  let file = await readFile(filePath, { encoding: "utf8" });

  const hasComments = removeComments.test(file);

  file = file.replace(removeWebpackCommentsRegex, "");

  if (hasComments) {
    file = file.replace(removeComments, "");
    if (!noLogs) {
      console.log(
        chalk.keyword("orange")(
          `[collectFileDeps]: please remove comments '(not the \`webpackChunkName\` ones)'` +
            `from ${chalk.white(logFileName)}`,
        ),
      );
    }
  }

  if (/webpackChunkName/.test(file)) {
    console.log(
      chalk.bold.red(
        `[collectFileDeps]: something went wrong when removing ${chalk.white(
          "webpackChunkName",
        )} in ${logFileName}, please report that.`,
      ),
    );

    process.exit(1);
  }

  let matchedImports = file.match(allImportsRegexp);

  if (!(Array.isArray(matchedImports) && !!matchedImports.length)) {
    return false;
  }

  matchedImports = matchedImports
    .toString()
    .replace(removeLineBreaksAndSpaces, "")
    .split(";");

  if (!matchedImports.length) {
    return false;
  }

  matchedImports = matchedImports
    .map((importStatementString) =>
      importStatementString.replace(charsAndImportsRegex, ""),
    )
    .filter(Boolean)
    // maybe the import could be
    // import some './some'
    // import some '../some'
    // import('./some')
    // import './some'
    // and we don't won't to declare relative imports as deps :).
    .filter((libName) => !libName.startsWith("."));

  if (!matchedImports.length) {
    return false;
  }

  return new Promise((resolve) => resolve(matchedImports));
};

module.exports = collectFileDeps;
