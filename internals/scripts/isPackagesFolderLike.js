/*
 *
 * `isPackageLike`: `scripts`
 *
 */
const throwIfCurrentRootIsNotExist = require("./throwIfCurrentRootIsNotExist");
const { PACKAGES_REGEX } = require("../constants/base");

const isPackagesFolderLike = (folderName) => {
  throwIfCurrentRootIsNotExist(folderName);

  return PACKAGES_REGEX.test(folderName);
};

module.exports = isPackagesFolderLike;
