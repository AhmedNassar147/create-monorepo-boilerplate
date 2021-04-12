/*
 *
 * `getFileLastModifiedTimes`: `scripts`.
 *
 */
const { stat } = require("fs/promises");
const invariant = require("./invariant");
const checkPathExists = require("./checkPathExists");

const getFileLastModifiedTimes = async (file) => {
  invariant(
    file,
    `(\`getFileLastModifiedTimes\`): file must be provided given "${file}".`,
  );

  const isFileExist = await checkPathExists(file);

  invariant(
    isFileExist,
    `(\`getFileLastModifiedTimes\`): file doesn't exist yet given "file=${file}".`,
  );

  const { mtime, ctime } = await stat(file);

  return {
    lastModifiedTime: mtime.getTime(),
    lastStatusModifiedTime: ctime.getTime(),
  };
};

module.exports = getFileLastModifiedTimes;
