/*
 *
 * `getCachedBuildDirectories`: `@domain/rollup-build-cache-plugin`.
 *
 */
const path = require("path");
const { stat } = require("fs/promises");

const getCachedBuildDirectories = async ({
  packageBuildDirectories,
  packageCacheDirectory,
}) => {
  const buildDirectoryChecksPromises = packageBuildDirectories.map(
    async (buildDir) => {
      const absolutePackageCacheDirectoryForBuildDir = path.join(
        packageCacheDirectory,
        buildDir,
      );

      try {
        await stat(absolutePackageCacheDirectoryForBuildDir);
        return absolutePackageCacheDirectoryForBuildDir;
      } catch (_) {
        return "";
      }
    },
  );

  return await Promise.all(buildDirectoryChecksPromises);
};

module.exports = getCachedBuildDirectories;
