/*
 *
 * `prepareDependenciesValidator`: `@domain/precommit-linter`.
 *
 */
const { execSync } = require("child_process");
const chalk = require("chalk");
const createCliLogMessage = require("./createCliLogMessage");
const { filesInPackagesRegexp, pathToPackageName } = require("./constants");
const { PROJECT_NAME_SPACE } = require("../../../internals/constants");

// const execAsync = promisify(exec);

const prepareDependenciesValidator = (stagedFiles) => {
  let packagesNamesToValidate = stagedFiles
    .filter((file) => filesInPackagesRegexp.test(file))
    .map((file) => {
      if (file && typeof file === "string") {
        const [matchedPackage] = file.match(pathToPackageName);
        return filesInPackagesRegexp.test(matchedPackage)
          ? matchedPackage
              .replace(filesInPackagesRegexp, "")
              .replace(/\//, "")
              .replace(/\/.+|\//g, "")
          : false;
      }
      return false;
    })
    .filter(Boolean);

  packagesNamesToValidate = [...new Set(packagesNamesToValidate)];

  const packagesToValidateDepsLength = packagesNamesToValidate.length;

  console.log(
    createCliLogMessage(
      packagesToValidateDepsLength
        ? chalk.bold.white(`getting "validate-packages-deps" started.`)
        : chalk.bold.cyan(
            `skipping "validate-packages-deps", no packages found in staged files.`,
          ),
    ),
  );

  if (packagesToValidateDepsLength) {
    let validatorResults = packagesNamesToValidate.map((package) => {
      package = `${PROJECT_NAME_SPACE}/${package}`;
      let errorResult = "";

      try {
        const stdout = execSync(
          `validate-packages-deps --filter=${package} --exitKey=1 --logOnlyResults`,
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
