/*
 *
 * `preparePackagesAssetsValidator`: `@domain/precommit-linter`.
 *
 */
const { execSync } = require("child_process");
const chalk = require("chalk");
const createCliLogMessage = require("./createCliLogMessage");

const preparePackagesAssetsValidator = (packagesNamesToValidate) => {
  const packagesToValidateDepsLength = packagesNamesToValidate.length;

  console.log(
    createCliLogMessage(
      packagesToValidateDepsLength
        ? chalk.bold.white(`getting "validate-packages-assets" started.`)
        : chalk.bold.cyan(
            `skipping "validate-packages-assets", no packages found in staged files.`,
          ),
    ),
  );

  if (packagesToValidateDepsLength) {
    try {
      const stdout = execSync(
        `validate-packages-assets --packages=${packagesNamesToValidate.join()} --logOnlyResults`,
        {
          encoding: "utf8",
        },
      );

      if (stdout) {
        console.log(createCliLogMessage(chalk.white(stdout.toString())));
      }
    } catch (error) {
      if (error && error.stdout) {
        process.emit("onError", error.stdout);
      }
    }
  }
};

module.exports = preparePackagesAssetsValidator;
