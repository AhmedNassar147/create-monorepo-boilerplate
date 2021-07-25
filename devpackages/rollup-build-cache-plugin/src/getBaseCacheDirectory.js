/*
 *
 * `getBaseCacheDirectory`: `@domain/rollup-build-cache-plugin`.
 *
 */
const { join } = require("path");
const { CACHE_DIRECTORY_NAME } = require("./constants");
const { findRootYarnWorkSpaces } = require("../../scripts");

const getBaseCacheDirectory = () =>
  join(
    findRootYarnWorkSpaces(),
    "node_modules",
    ".cache",
    CACHE_DIRECTORY_NAME,
  );

module.exports = getBaseCacheDirectory;
