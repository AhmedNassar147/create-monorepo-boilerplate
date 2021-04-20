/*
 *
 * `getPaths`: `rollup`.
 *
 */
const path = require("path");
const getWorkSpaceBasePath = require("../workspaces/getWorkSpaceBasePath");

const getPaths = (packageName) => {
  const absolutePackagePath = getWorkSpaceBasePath(packageName);

  return {
    packageJsonPath: path.join(absolutePackagePath, "package.json"),
    fullPathPackageSrcPath: path.join(absolutePackagePath, "src"),
    cjsBuildFolder: path.join(absolutePackagePath, "dist/cjs"),
    esmBuildFolder: path.join(absolutePackagePath, "dist/esm"),
  };
};

module.exports = getPaths;
