/*
 *
 * `checkPathExists`: `@domain/scripts`.
 *
 */
const { stat } = require("fs/promises");

const checkPathExists = async (filePath) => {
  return stat(filePath)
    .then(() => filePath)
    .catch(() => false);
};
module.exports = checkPathExists;
