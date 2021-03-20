/*
 *
 * `getPackageAlias`: `scripts`.
 *
 */
const getWorkSpacesData = require("./getWorkSpacesData");

const getPackageAlias = (packageName) => {
  const packagesData = getWorkSpacesData();

  const { [packageName]: mainPackageName, ...packageAlias } = packagesData;

  return packageAlias;
};

module.exports = getPackageAlias;
