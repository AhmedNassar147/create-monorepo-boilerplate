/*
 *
 * `getFilePathBasedOnProjectName`: `@domain/scripts`.
 *
 */
const getProjectName = require("./getProjectName");

const getFilePathBasedOnProjectName = (filePath, removeProjectName) => {
  const projectName = getProjectName();

  const selectorRegexp = new RegExp(`${projectName}.+`);

  filePath = (filePath.match(selectorRegexp) || [])[0];
  filePath = removeProjectName
    ? filePath.replace(new RegExp(`${projectName}/`), "")
    : filePath;

  return filePath;
};

module.exports = getFilePathBasedOnProjectName;
