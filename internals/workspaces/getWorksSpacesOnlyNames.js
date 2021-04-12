/*
 *
 * `getWorksSpacesOnlyNames`: `workspaces`.
 *
 */
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");

const getWorksSpacesOnlyNames = async () => {
  return new Promise((resolve) => resolve(getWorksSpacesOnlyNamesSync()));
};

module.exports = getWorksSpacesOnlyNames;
