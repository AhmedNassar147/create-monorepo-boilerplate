/*
 *
 * `getPackageNameAndExcludeNameSpace`: `scripts`.
 *
 */
const getPackageNameAndExcludeNameSpace = (packageName) =>
  packageName.replace(/@.+?\//g, "");

module.exports = getPackageNameAndExcludeNameSpace;
