/*
 *
 * `getProjectName`: `@domain/scripts`.
 *
 */
const { basename } = require("path");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");

const getProjectName = () => {
  const rootPath = findRootYarnWorkSpaces(undefined, 150);

  return basename(rootPath);
};

module.exports = getProjectName;
