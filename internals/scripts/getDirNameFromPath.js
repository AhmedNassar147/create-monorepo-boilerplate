/*
 *
 * `getDirNameFromPath`: `scripts`.
 *
 */
const { dirname } = require("path");

const getDirNameFromPath = async (filePath, basePathOutOfFileDir) => {
  if (basePathOutOfFileDir) {
    filePath = filePath.replace(basePathOutOfFileDir, "");
  }

  return Promise.resolve(dirname(filePath));
};

module.exports = getDirNameFromPath;
