/*
 *
 * Package: `@domain/assets-helpers`.
 *
 */
const getPackageAssetsData = require("./getPackageAssetsData");
const collectAssetsFromPath = require("./collectAssetsFromPath");
const haveAssetsChanged = require("./haveAssetsChanged");
const replaceAssetAndSlashFromArray = require("./replaceAssetAndSlashFromArray");
const collectAssetsFormGivenPackages = require("./collectAssetsFormGivenPackages");
const {
  validFilesRegexp,
  assetsPathsRegexp,
  assetsAndFirstSlashRegexp,
} = require("./constants");

module.exports = {
  collectAssetsFromPath,
  getPackageAssetsData,
  collectAssetsFormGivenPackages,
  haveAssetsChanged,
  replaceAssetAndSlashFromArray,
  validFilesRegexp,
  assetsPathsRegexp,
  assetsAndFirstSlashRegexp,
};
