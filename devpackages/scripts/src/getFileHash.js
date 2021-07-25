/*
 *
 * `getFileHash`: `@domain/scripts`.
 *
 */
const crypto = require("crypto");
const { readFile } = require("fs/promises");

const getFileHash = async (absoluteFilePath) => {
  const fileBuffer = await readFile(absoluteFilePath);

  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);

  return hashSum.digest("hex");
};

module.exports = getFileHash;
