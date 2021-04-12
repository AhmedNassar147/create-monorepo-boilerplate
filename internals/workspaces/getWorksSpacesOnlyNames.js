/*
 *
 * `getWorksSpacesOnlyNames`: `workspaces`.
 *
 */
const getWorksSpacesOnlyNames = async () => {
  return new Promise((resolve) => resolve(getWorksSpacesOnlyNamesSync()));
};

module.exports = getWorksSpacesOnlyNames;
