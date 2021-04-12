/*
 *
 * `getWorksSpacesOnlyNamesSync`: `workspaces`.
 *
 */
const getProperWorkSpaceName = require("./getProperWorkSpaceName");
const getRootPackageJsonSync = require("../scripts/getRootPackageJsonSync");

const getWorksSpacesOnlyNamesSync = () => {
  const { workspaces } = getRootPackageJsonSync();

  return workspaces.map(getProperWorkSpaceName);
};

module.exports = getWorksSpacesOnlyNamesSync;
