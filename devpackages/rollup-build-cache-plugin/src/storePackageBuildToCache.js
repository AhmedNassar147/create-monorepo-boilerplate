/*
 *
 * `storePackageBuildToCache`: `@dbh/yarn-packages-build-cache`.
 *
 */
const path = require("path");
const chalk = require("chalk");
const getPackageCacheDirectory = require("./getPackageCacheDirectory");
const { copyDirectory } = require("../../scripts");

const storePackageBuildToCache = async (
  packageHashSum,
  absolutePackagePath,
  absolutePackageBuildDirectory,
  displayPackageCacheDirectory,
) => {
  const packageCacheDirectory = getPackageCacheDirectory(
    packageHashSum,
    absolutePackagePath,
  );

  const dest = path.join(
    packageCacheDirectory,
    path.basename(absolutePackageBuildDirectory),
  );

  await copyDirectory(absolutePackageBuildDirectory, dest);

  console.log(
    chalk.bold.green(`Stored to cache: (${displayPackageCacheDirectory})`),
  );
};

module.exports = storePackageBuildToCache;
