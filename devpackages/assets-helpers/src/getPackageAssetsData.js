/*
 *
 * `getPackageAssetsData`: `@domain/assets-helpers`.
 *
 */
const { join } = require("path");
const haveAssetsChanged = require("./haveAssetsChanged");
const collectAssetsFromPath = require("./collectAssetsFromPath");
const { validFilesRegexp } = require("./constants");
const {
  PACKAGES_MODULES_REGEX,
  getWorkSpacesData,
  toPackageNameWithScope,
} = require("../../scripts");

const getPackageAssetsData = async ({
  packageName,
  logInfo = true,
  scriptName,
}) => {
  packageName = toPackageNameWithScope(packageName);

  const results = {
    error: "",
    oldAssetPaths: [],
    newAssetsPaths: [],
    isSameAssets: true,
    packageName,
  };

  const { [packageName]: packageConfig } = getWorkSpacesData({
    onlyTheseWorkSpacesNamesRegex: PACKAGES_MODULES_REGEX,
    packageNamesFilterRegex: new RegExp(`^${packageName}$`),
  });

  if (!packageConfig) {
    results.error = `${packageName} package not found.`;
    return results;
  }

  const { assetsPaths: oldAssetPaths, packagePath } = packageConfig;

  const { error, assetsPaths } = await collectAssetsFromPath({
    pathToCollectAssetsFrom: join(packagePath, "src"),
    onlyTheseExtensionsRegex: validFilesRegexp.ONLY_TS_OR_JS_FILES,
    logInfo,
    scriptName,
  });

  if (error) {
    results.error = error;
    return results;
  }

  const isSameAssets = !haveAssetsChanged(oldAssetPaths, assetsPaths);

  results.isSameAssets = isSameAssets;
  results.newAssetsPaths = assetsPaths;
  results.oldAssetPaths = oldAssetPaths;

  return results;
};

module.exports = getPackageAssetsData;
