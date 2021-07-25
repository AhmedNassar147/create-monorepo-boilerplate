/*
 *
 * `getPackageCacheDirectory`: `@domain/rollup-build-cache-plugin`.
 *
 */
const path = require("path");
const getBaseCacheDirectory = require("./getBaseCacheDirectory");

const getPackageCacheDirectory = (packageHashSum, absolutePackagePath) => {
  return path.join(
    getBaseCacheDirectory(),
    path.basename(absolutePackagePath),
    packageHashSum,
  );
};

module.exports = getPackageCacheDirectory;
