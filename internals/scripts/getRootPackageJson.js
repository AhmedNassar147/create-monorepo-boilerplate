/*
 *
 * `getRootPackageJson`: `scripts`.
 *
 */
const { join } = require("path");
const readJsonFileSync = require("./readJsonFileSync");
const getProjectRootDirectoryPath = require("./getProjectRootDirectoryPath");
const { PKG_JSON_EXT } = require("../constants/base");

const getRootPackageJson = () =>
  readJsonFileSync(join(getProjectRootDirectoryPath(), PKG_JSON_EXT), true);

module.exports = getRootPackageJson;
