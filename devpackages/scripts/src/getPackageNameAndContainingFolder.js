/*
 *
 * `getPackageNameAndContainingFolder`: `@domain/scripts`.
 *
 */
const { PACKAGE_PATH_LIKE_REGEXP } = require("./constants");

// returns false if provide path not matching package regex or
// received undefined packagePath and it return [folderName, packageName] if
// above not verified.
const getPackageNameAndContainingFolder = (
  packagePath,
  withContainingFolder,
) => {
  if (!packagePath) {
    return false;
  }

  const isLikePackage = PACKAGE_PATH_LIKE_REGEXP.test(packagePath);

  if (!isLikePackage) {
    return false;
  }

  let [packageNamePath] = packagePath.match(PACKAGE_PATH_LIKE_REGEXP);
  packageNamePath = packageNamePath.split("/");

  const length = packageNamePath.length;

  const packageName = packageNamePath[length - 1];

  if (!withContainingFolder) {
    return packageName;
  }

  return length === 2
    ? packageNamePath
    : [packageNamePath[length - 2], packageName];
};

module.exports = getPackageNameAndContainingFolder;
