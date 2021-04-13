/*
 * `selectAllModules`: `workspaces`.
 *
 */
const { MODULES_REGEX } = require("../constants/base");
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");

const selectAllModules = () => {
  const modulesNames = getWorksSpacesOnlyNamesSync().filter((workSpace) =>
    MODULES_REGEX.test(workSpace),
  );

  return modulesNames;
};

module.exports = selectAllModules;
