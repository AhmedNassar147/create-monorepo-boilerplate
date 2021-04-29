/*
 *
 * `collectAssetsFormGivenPackages`: `assetsHelpers`.
 *
 */
const chalk = require("chalk");
const getPackageAssetsData = require("./getPackageAssetsData");

const collectAssetsFormGivenPackages = async ({
  packages,
  logInfo = true,
  scriptName,
}) => {
  const results = {
    errors: [],
    mismatchedAssets: [],
  };

  if (!packages) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        `"packages" must be defined given ${packages}`,
      )}`,
    );

    process.exit(1);
  }

  packages = packages.filter(Boolean);

  if (!packages.length) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        `please provide at least one package given ${packages}`,
      )}`,
    );

    process.exit(1);
  }

  const packageDataConfigs = await Promise.all(
    packages.map((packageName) =>
      getPackageAssetsData({
        packageName,
        logInfo,
        scriptName,
      }),
    ),
  );

  packageDataConfigs.forEach(
    ({ error, newAssetsPaths, isSameAssets, packageName }) => {
      if (error) {
        results.errors.push(`${error}\n`);
      }

      if (!isSameAssets) {
        results.mismatchedAssets.push([packageName, newAssetsPaths]);
      } else {
        if (!error && !logInfo) {
          console.log(
            `${chalk.magenta(`[${scriptName}]`)} ${chalk.keyword("orange")(
              `skipping "${chalk.bold.white(packageName)}" no assets changes.`,
            )}`,
          );
        }
      }
    },
  );

  return results;
};

module.exports = collectAssetsFormGivenPackages;
