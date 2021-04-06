/*
 *
 * `getWorksSpacesWithoutOnlyNames`: `scripts`.
 *
 */
const getProperWorkSpaceName = require("./getProperWorkSpaceName");
const getRootPackageJson = require("./getRootPackageJson");

const getWorksSpacesWithoutOnlyNames = () => {
  const { workspaces } = getRootPackageJson();

  return workspaces.map(getProperWorkSpaceName);
};

module.exports = getWorksSpacesWithoutOnlyNames;
