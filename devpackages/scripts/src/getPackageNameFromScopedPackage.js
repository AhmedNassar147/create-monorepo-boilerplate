/*
 *
 * `getPackageNameFromScopedPackage`: `@domain/scripts`.
 *
 */
const chalk = require("chalk");

const getPackageNameFromScopedPackage = (packageName) => {
  if (!packageName) {
    console.log(
      chalk.bold.red(
        `\`(getPackageNameFromScopedPackage):\` packageName must be defined, given ${packageName}.`,
      ),
    );
    process.exit(1);
  }

  return packageName.replace(/@\w.+\//, "");
};

module.exports = getPackageNameFromScopedPackage;
