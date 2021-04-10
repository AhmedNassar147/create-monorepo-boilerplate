/*
 *
 * `checkPathExists`: `scripts`
 *
 */
const { stat } = require("fs/promises");

const checkPathExists = async (path) => {
  return stat(path)
    .then(() => path)
    .catch(() => false);
};
module.exports = checkPathExists;
