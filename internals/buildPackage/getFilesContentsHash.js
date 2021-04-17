/*
 *
 * `getFilesContentsHash`: `buildPackage`.
 *
 */
const getFileMd5 = require("./getFileMd5");

const getFilesContentsHash = async (files) => {
  const filesConfigPromises = files.map(async (file) => {
    const fileContentHashData = await getFileMd5(file);
    return [file, fileContentHashData];
  });

  const allFilesWithTimes = await Promise.all(filesConfigPromises);

  return Promise.resolve(
    allFilesWithTimes.reduce((acc, [file, fileContentHashData]) => {
      return acc.set(file, fileContentHashData);
    }, new Map()),
  );
};

module.exports = getFilesContentsHash;
