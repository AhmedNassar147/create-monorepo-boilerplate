/*
 * `packageExists`: `utils`.
 *
 *  Check if the given `package` exists.
 *
 */
const { readdirSync } = require("fs");
const { getWorksSpacesOnlyNamesSync, APPS_REGEX } = require("../../../scripts");

const packageExists = (comp) => {
  const apps = [];
  const workspaces = getWorksSpacesOnlyNamesSync().filter((workSpace) => {
    if (APPS_REGEX.test(workSpace)) {
      apps.push(workSpace);

      return false;
    }

    return true;
  });

  const packages = workspaces.map((workSpace) => readdirSync(workSpace)).flat();

  return [...packages, ...apps].indexOf(comp) >= 0;
};

module.exports = packageExists;
