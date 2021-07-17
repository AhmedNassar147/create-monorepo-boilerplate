/*
 *
 * `getWorksSpacesOnlyNamesSync`: `@domain/scripts`.
 *
 */
const getProperWorkSpaceName = require("./getProperWorkSpaceName");
const getRootPackageJsonSync = require("./getRootPackageJsonSync");

const getWorksSpacesOnlyNamesSync = (filterRegexp) => {
  const { workspaces } = getRootPackageJsonSync();

  let properWorkSpacesNames = workspaces.map(getProperWorkSpaceName);

  if (filterRegexp && properWorkSpacesNames && properWorkSpacesNames.length) {
    properWorkSpacesNames = properWorkSpacesNames.filter((workSpace) =>
      filterRegexp.test(workSpace),
    );
  }

  return properWorkSpacesNames;
};

module.exports = getWorksSpacesOnlyNamesSync;
