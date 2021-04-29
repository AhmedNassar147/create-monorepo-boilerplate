/*
 *
 * `replaceAssetAndSlashFromArray`: `assetsHelpers`.
 *
 */
const { assetsAndFirstSlashRegexp } = require("./constants");

const replaceAssetAndSlashFromArray = (arr) => {
  if (Array.isArray(arr) && arr.length) {
    return arr.toString().replace(assetsAndFirstSlashRegexp, "").split(",");
  }

  return arr;
};

module.exports = replaceAssetAndSlashFromArray;
