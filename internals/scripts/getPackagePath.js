/*
 *
 * `getPackagePath`: `scripts`.
 *
 */
const { existsSync } = require("fs");
const invariant = require("./invariant");
const getWorkSpacesData = require("./getWorkSpacesData");
const { PROJECT_NAME_SPACE } = require("../constants/base");

// given `@domain/pkg1` will return `basePath/create-react-monorepo-boilerplate/packages/pkg1`
const getPackagePath = (name) => {
  invariant(!!name, `package name must be provided given: name=\`${name}\`.`);

  name = name.includes(PROJECT_NAME_SPACE)
    ? name
    : `${PROJECT_NAME_SPACE}/${name}`;

  const packageBasePath = getWorkSpacesData()[name];

  invariant(
    packageBasePath || (!!packageBasePath && existsSync(packageBasePath)),
    `couldn't find package called \`${name}\`.`,
  );

  return packageBasePath;
};

module.exports = getPackagePath;
