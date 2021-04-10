/*
 *
 * `getCurrentRootDirectoryPath`: `scripts`.
 *
 */
const { realpath } = require("fs/promises");

module.exports = async function () {
  return await realpath(process.cwd());
};
