/*
 *
 * Constants: `@domain/precommit-linter`.
 *
 */
const { PACKAGES_MODULES_REGEX } = require("../../../internals/constants");

const filesExtensionToLint = /\.(tsx|js|ts)$/;
const ignoredFilesRegexp = /^\file.(\w.+ignore|.production)|env|lock$/;

const PACKAGES_MODULES_REGEX_STRING = `${PACKAGES_MODULES_REGEX}`.replace(
  /\/|\$/g,
  "",
);

const filesInPackagesRegexp = new RegExp(PACKAGES_MODULES_REGEX_STRING);

const pathToPackageName = /^(\w.+-module|packages)\W.+\/{1}/gim;

module.exports = {
  filesExtensionToLint,
  ignoredFilesRegexp,
  filesInPackagesRegexp,
  pathToPackageName,
};