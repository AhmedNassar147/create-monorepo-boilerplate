/*
 * `getFileMd5`: `buildPackage`.
 *
 */
const { readFile } = require("fs/promises");
const { createHash } = require("crypto");
const invariant = require("../scripts/invariant");
const checkPathExists = require("../scripts/checkPathExists");

const encoding = "utf8";

const getFileMD5 = async (filePath) => {
  invariant(
    filePath,
    `(\`getFileMD5\`): filePath must be provided given "${filePath}".`,
  );

  const isFileExist = await checkPathExists(filePath);

  invariant(
    isFileExist,
    `(\`getFileMD5\`): filePath doesn't exist yet given "file=${filePath}".`,
  );

  const fileData = await readFile(filePath, { encoding });

  return Promise.resolve({
    fileHash: createHash("md5")
      .update(fileData, encoding)
      .digest("hex")
      .slice(0, 18),
    hasContent: !!fileData,
  });
};

module.exports = getFileMD5;
