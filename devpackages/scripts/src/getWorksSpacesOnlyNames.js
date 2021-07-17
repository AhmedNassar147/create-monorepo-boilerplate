/*
 *
 * `getWorksSpacesOnlyNames`: `@domain/scripts`.
 *
 */
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");

const getWorksSpacesOnlyNames = async (filterRegexp) => {
  return new Promise((resolve) =>
    resolve(getWorksSpacesOnlyNamesSync(filterRegexp)),
  );
};

module.exports = getWorksSpacesOnlyNames;
