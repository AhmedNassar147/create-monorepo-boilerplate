/*
 *
 * getOptimizedAssetsManifestPath: `@domain/optimize-images`.
 *
 */
const { join } = require("path");
const { findRootYarnWorkSpaces } = require("../../scripts");

const getOptimizedAssetsManifestPath = () =>
  join(findRootYarnWorkSpaces(), "generated", "optimizedAssetsManifest.json");

module.exports = getOptimizedAssetsManifestPath;
