/*
 *
 * `getGeneratedRoutesFilePath`: `@domain/scripts`.
 *
 */
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");

const getGeneratedRoutesFilePath = (fileName) => {
  return `${findRootYarnWorkSpaces()}/generated/routes/${fileName}`;
};

module.exports = getGeneratedRoutesFilePath;
