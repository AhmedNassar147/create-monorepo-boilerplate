/*
 *
 * `prepareDependenciesValidator`: `@domain/precommit-linter`.
 *
 */
const { execSync } = require("child_process");
const chalk = require("chalk");
const createCliLogMessage = require("./createCliLogMessage");
const { toPackageNameWithScope } = require("../../scripts");
const { scriptName } = require("../../validate-packages-deps/src/constants");

const prepareDependenciesValidator = (packagesNamesToValidate) => {
  const packagesToValidateDepsLength = packagesNamesToValidate.length;

  console.log(
    createCliLogMessage(
      packagesToValidateDepsLength
        ? chalk.bold.white(`getting "${scriptName}" started.`)
        : chalk.bold.cyan(
            `skipping "${scriptName}", no packages found in staged files.`,
          ),
    ),
  );

  if (packagesToValidateDepsLength) {
    let validatorResults = packagesNamesToValidate.map((package) => {
      package = toPackageNameWithScope(package);
      let errorResult = "";

      try {
        const stdout = execSync(
          `"${scriptName}" --filter=${package} --exitKey=1 --logOnlyResults`,
          {
            encoding: "utf8",
          },
        );

        if (stdout) {
          console.log(createCliLogMessage(chalk.white(stdout.toString())));
        }

        errorResult = false;
      } catch (error) {
        if (error && error.stdout) {
          errorResult = error.stdout.toString();
        }
      }

      return errorResult;
    });

    validatorResults = validatorResults.filter(Boolean);
    if (validatorResults.length) {
      validatorResults.forEach((stdoutError) => {
        process.emit("onError", stdoutError);
      });
    }
  }
};

module.exports = prepareDependenciesValidator;
