/*
 * `packageExists`: `utils`.
 *
 *  Check if the given `package` exists.
 *
 */
const { readdirSync } = require("fs");
const invariant = require("../../scripts/invariant");
const getWorksSpacesOnlyNamesSync = require("../../workspaces/getWorksSpacesOnlyNamesSync");

const packageExists = (comp) => {
  const apps = [];
  let workspaces = getWorksSpacesOnlyNamesSync().filter((workSpace) => {
    if (workSpace.endsWith("app")) {
      apps.push(workSpace);

      return false;
    }

    return true;
  });

  invariant(!!workspaces.length, `couldn't collect workspaces names.`);

  const packages = workspaces.map((workSpace) => readdirSync(workSpace)).flat();

  return [...packages, ...apps].indexOf(comp) >= 0;
};

module.exports = packageExists;
