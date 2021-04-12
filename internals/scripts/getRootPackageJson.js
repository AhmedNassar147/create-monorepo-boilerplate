/*
 *
 * `getRootPackageJson`: `scripts`.
 *
 */
const getRootPackageJsonSync = require("./getRootPackageJsonSync");

const getRootPackageJson = async () => {
  return new Promise((resolve) => resolve(getRootPackageJsonSync());
};

module.exports = getRootPackageJson;
