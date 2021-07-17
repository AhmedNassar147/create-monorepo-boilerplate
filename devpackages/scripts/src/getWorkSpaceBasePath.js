/*
 *
 * `getWorkSpaceBasePath`: `@domain/scripts`.
 *
 */
const getWorkSpacesData = require("./getWorkSpacesData");
const toPackageNameWithScope = require("./toPackageNameWithScope");
const invariant = require("./invariant");

const getWorkSpaceBasePath = (name) => {
  invariant(!!name, `package name must be provided given: name=\`${name}\`.`);

  name = toPackageNameWithScope(name);

  const {
    [name]: { packagePath },
  } = getWorkSpacesData();

  invariant(packagePath, `couldn't find package called \`${name}\`.`);

  return packagePath;
};

module.exports = getWorkSpaceBasePath;
