/*
 *
 * `getPaths`: `buildPackage`.
 *
 */
const path = require("path");
const getCurrentRootDirectoryPath = require("../scripts/getCurrentRootDirectoryPath");

const getPaths = async () => {
  const absolutePackagePath = await getCurrentRootDirectoryPath();

  return {
    absolutePackagePath,
    fullPathPackageSrcPath: path.join(absolutePackagePath, "src"),
    cjsBuildFolder: path.join(absolutePackagePath, "dist"),
    esmBuildFolder: path.join(absolutePackagePath, "module"),
  };
};

module.exports = getPaths;
