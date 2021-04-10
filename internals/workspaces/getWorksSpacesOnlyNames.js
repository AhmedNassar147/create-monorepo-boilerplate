/*
 *
 * `getWorksSpacesOnlyNames`: `workspaces`.
 *
 */
const getProperWorkSpaceName = require("./getProperWorkSpaceName");
const getRootPackageJson = require("../scripts/getRootPackageJson");

const getWorksSpacesOnlyNames = async () => {
  const { workspaces } = await getRootPackageJson();

  return Promise.resolve(workspaces.map(getProperWorkSpaceName));
};

module.exports = getWorksSpacesOnlyNames;
