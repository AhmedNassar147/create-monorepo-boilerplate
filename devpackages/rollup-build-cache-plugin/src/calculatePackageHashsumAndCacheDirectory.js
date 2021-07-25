/*
 *
 * `calculatePackageHashsumAndCacheDirectory`: `@domain/rollup-build-cache-plugin`.
 *
 */
const path = require("path");
const getPackageHashSum = require("./getPackageHashSum");
const getPackageCacheDirectory = require("./getPackageCacheDirectory");

const calculatePackageHashsumAndCacheDirectory = async ({
  currentEnv,
  absolutePackagePath,
}) => {
  const packageHashSum = await getPackageHashSum({
    packageSrcPath: path.join(absolutePackagePath, "src"),
    currentEnv,
  });

  const packageCacheDirectory = getPackageCacheDirectory(
    packageHashSum,
    absolutePackagePath,
  );

  const displayPackageCacheDirectory = path
    .basename(packageCacheDirectory)
    .slice(0, 10);

  return {
    packageHashSum,
    packageCacheDirectory,
    displayPackageCacheDirectory,
  };
};

module.exports = calculatePackageHashsumAndCacheDirectory;
