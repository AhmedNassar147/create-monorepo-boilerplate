/*
 *
 * `validatePackagesAssets`: `@domain/validate-packages-assets`.
 *
 */
const chalk = require("chalk");
const { collectAssetsFormGivenPackages } = require("../../assets-helpers");

const scriptName = "domain-validate-packages-assets";

const logSucceedMessage = (success) =>
  console.log(
    `${chalk.magenta(`[${scriptName}]`)} done ${
      success ? "successfully. ✨✨" : "."
    }`,
  );

const validatePackagesAssets = async ({ packages, logOnlyResults }) => {
  try {
    const { errors, mismatchedAssets } = await collectAssetsFormGivenPackages({
      packages: typeof packages === "string" ? packages.split(",") : packages,
      logInfo: !logOnlyResults,
      scriptName,
    });

    const mismatchedAssetsLength = mismatchedAssets.length;
    const errorsLength = errors.length;

    if (mismatchedAssetsLength || errorsLength) {
      if (mismatchedAssetsLength) {
        mismatchedAssets.forEach((params) => {
          const [packageName, newAssetsPaths] = params;

          params[0] = `Please update the follow assets paths in ${chalk.bold.white(
            `the package.json of ${packageName}`,
          )}`;
          params[1] = `"assetsPaths": ${JSON.stringify(
            newAssetsPaths,
            null,
            2,
          )}`;

          console.log(
            `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
              `${params.join("\n")}\n`,
            )}`,
          );
        });
      }

      if (errorsLength) {
        errors.forEach((error) => {
          console.log(
            `${chalk.magenta(`[${scriptName}]`)} ${chalk.bold.red(error)}`,
          );
        });
      } else {
        logSucceedMessage();
      }

      process.exit(mismatchedAssetsLength || errorsLength ? 1 : 0);
    }

    logSucceedMessage(true);
  } catch (error) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.bold.red(
        `something went wrong  ${error}`,
      )}`,
    );
    process.exit(1);
  }
};

module.exports.validatePackagesAssets = validatePackagesAssets;
module.exports.scriptName = scriptName;
