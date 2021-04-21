/*
 *
 * `getWorkSpaceBasePath`: `workspaces`.
 *
 */
const getWorkSpacesData = require("./getWorkSpacesData");
const invariant = require("../scripts/invariant");
const { PROJECT_NAME_SPACE } = require("../constants");

// given `@domain/pkg1` will return `basePath/create-react-monorepo-boilerplate/packages/pkg1`
const getWorkSpaceBasePath = (name) => {
  invariant(!!name, `package name must be provided given: name=\`${name}\`.`);

  name = name.includes(PROJECT_NAME_SPACE)
    ? name
    : `${PROJECT_NAME_SPACE}/${name}`;

  const {
    [name]: { packagePath },
  } = getWorkSpacesData();

  invariant(packagePath, `couldn't find package called \`${name}\`.`);

  return packagePath;
};

module.exports = getWorkSpaceBasePath;
