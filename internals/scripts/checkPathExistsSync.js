/*
 *
 * `checkPathExistsSync`: `scripts`
 *
 */
const { existsSync } = require("fs");

const checkPathExistsSync = (path) => {
  let result = false;

  try {
    const isExist = existsSync(path);
    result = isExist ? path : false;
  } catch (error) {
    result = false;
  }

  return result;
};
module.exports = checkPathExistsSync;
