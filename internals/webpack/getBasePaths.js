/*
 *
 * `getBasePaths`: `webpack`.
 *
 */
const { join, resolve } = require("path");

module.exports = function getBasePaths(basePath) {
  const srcEntry = join(basePath, "src");

  return {
    srcEntry,
    assetsPath: join(srcEntry, "assets"),
    entry: join(srcEntry, "index"),
    output: join(basePath, "build"),
    public: resolve(basePath, "public"),
    tsConfigPath: resolve(basePath, "tsconfig.json"),
  };
};
