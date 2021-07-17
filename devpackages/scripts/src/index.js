/*
 *
 * Package: `@domains/scripts`.
 *
 */
const checkPathExists = require("./checkPathExists");
const checkPathExistsSync = require("./checkPathExistsSync");
const readJsonFile = require("./readJsonFile");
const readJsonFileSync = require("./readJsonFileSync");
const delayProcess = require("./delayProcess");
const getPackageNameAndContainingFolder = require("./getPackageNameAndContainingFolder");
const getAllFilesFromFolder = require("./getAllFilesFromFolder");
const invariant = require("./invariant");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");
const getWorkSpacesData = require("./getWorkSpacesData");
const toPackageNameWithScope = require("./toPackageNameWithScope");
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");
const getProperWorkSpaceName = require("./getProperWorkSpaceName");
const getRootPackageJsonSync = require("./getRootPackageJsonSync");
const getPackageNameFromScopedPackage = require("./getPackageNameFromScopedPackage");
const getWorkSpaceBasePath = require("./getWorkSpaceBasePath");
const updateJsonFileSync = require("./updateJsonFileSync");
const getGeneratedRoutesFilePath = require("./getGeneratedRoutesFilePath");
const {
  MODULES_REGEX,
  PROJECT_NAME_SPACE,
  APPS_REGEX,
  PACKAGES_REGEX,
  PACKAGES_MODULES_REGEX,
  SUPPORTED_IMAGES_REGEX,
  SUPPORTED_FONTS_REGEX,
  PACKAGE_FULL_NAME_REGEXP,
  PACKAGE_PATH_LIKE_REGEXP,
} = require("./constants");

module.exports = {
  checkPathExists,
  readJsonFileSync,
  checkPathExistsSync,
  getAllFilesFromFolder,
  invariant,
  findRootYarnWorkSpaces,
  getWorkSpacesData,
  toPackageNameWithScope,
  getWorksSpacesOnlyNamesSync,
  getProperWorkSpaceName,
  getRootPackageJsonSync,
  readJsonFile,
  delayProcess,
  getPackageNameAndContainingFolder,
  getPackageNameFromScopedPackage,
  getWorkSpaceBasePath,
  updateJsonFileSync,
  getGeneratedRoutesFilePath,
  MODULES_REGEX,
  PROJECT_NAME_SPACE,
  APPS_REGEX,
  PACKAGES_REGEX,
  PACKAGES_MODULES_REGEX,
  SUPPORTED_IMAGES_REGEX,
  SUPPORTED_FONTS_REGEX,
  PACKAGE_FULL_NAME_REGEXP,
  PACKAGE_PATH_LIKE_REGEXP,
};
