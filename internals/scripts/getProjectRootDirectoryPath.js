/*
 *
 * `getProjectRootDirectoryPath`: `scripts`.
 *
 */
const fs = require("fs");

module.exports = function () {
  return fs.realpathSync(process.cwd());
};
