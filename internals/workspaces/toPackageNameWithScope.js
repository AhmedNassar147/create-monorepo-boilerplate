/*
 *
 * `toPackageNameWithScope`: `workspaces`.
 *
 */
const chalk = require("chalk");
const {
  PACKAGE_FULL_NAME_REGEXP,
  PROJECT_NAME_SPACE,
} = require("../constants");

const toPackageNameWithScope = (packageName) => {
  if (!packageName) {
    console.log(
      chalk.bold.red(
        `\`(toPackageNameWithScope):\` packageName must be defined, given ${packageName}.`,
      ),
    );

    process.exit(1);
  }

  return PACKAGE_FULL_NAME_REGEXP.test(packageName)
    ? packageName
    : `${PROJECT_NAME_SPACE}/${packageName}`;
};

module.exports = toPackageNameWithScope;
