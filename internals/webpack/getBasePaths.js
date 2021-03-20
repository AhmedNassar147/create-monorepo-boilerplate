/*
 *
 * `getBasePaths`: `webpack`.
 *
 */
const path = require("path");

module.exports = function getBasePaths(basePath) {
  const srcEntry = path.join(basePath, "src");

  return {
    srcEntry,
    assetsPath: path.join(srcEntry, "src/assets"),
    entry: path.join(srcEntry, "index"),
    output: path.join(basePath, "build"),
    public: path.resolve(basePath, "public"),
    folderTsConfigPath: path.resolve(basePath, "tsconfig.json"),
  };
};
