/*
 *
 * `getWorkSpaceBasePath`: `workspaces`.
 *
 */
const getWorkSpacesData = require("./getWorkSpacesData");
const invariant = require("../scripts/invariant");
const { PROJECT_NAME_SPACE } = require("../constants/base");

// given `@domain/pkg1` will return `basePath/create-react-monorepo-boilerplate/packages/pkg1`
const getWorkSpaceBasePath = async (name) => {
  invariant(!!name, `package name must be provided given: name=\`${name}\`.`);

  name = name.includes(PROJECT_NAME_SPACE)
    ? name
    : `${PROJECT_NAME_SPACE}/${name}`;

  const { [name]: packageBasePath } = await getWorkSpacesData();

  invariant(packageBasePath, `couldn't find package called \`${name}\`.`);

  return Promise.resolve(packageBasePath);
};

module.exports = getWorkSpaceBasePath;
