/*
 *
 * `getBasePaths`: `@domain/webpack`.
 *
 */
const { join, resolve } = require("path");

module.exports = function getBasePaths(basePath) {
  const srcEntry = join(basePath, "src");

  return {
    srcEntry,
    assetsPath: join(srcEntry, "assets"),
    entrypoint: join(srcEntry, "index.tsx"),
    buildDirPath: join(basePath, "build"),
    publicPath: join(basePath, "public"),
    tsConfigPath: resolve(basePath, "tsconfig.json"),
  };
};
