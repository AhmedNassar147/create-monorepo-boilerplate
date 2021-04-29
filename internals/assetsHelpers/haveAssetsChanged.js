/*
 *
 * `haveAssetsChanged`: `assetsHelpers`.
 *
 */

const haveAssetsChanged = (oldAssetsPaths, newAssetsPaths) => {
  const [oldAssetsPathsString, newAssetsPathsString] = [
    oldAssetsPaths,
    newAssetsPaths,
  ].map((assetsArray) => JSON.stringify((assetsArray || []).sort()));

  return oldAssetsPathsString !== newAssetsPathsString;
};

module.exports = haveAssetsChanged;
