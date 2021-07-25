/*
 *
 * `getFolderFilesHashSum`: `@domain/scripts`.
 *
 */
const getFilesFromDirectory = require("./getAllFilesFromFolder");
const getFileHash = require("./getFileHash");
const checkPathExists = require("./checkPathExists");
const createLogger = require("./logMessage");

const logMessage = createLogger("getFolderFilesHashSum");

const getFolderFilesHashSum = async (folderPath) => {
  const doesFolderPathExist = await checkPathExists(folderPath);

  if (!doesFolderPathExist) {
    logMessage("Expected `folderPath` to be exist.", true);
  }

  const allFilesInFolder = await getFilesFromDirectory(folderPath);

  if (!allFilesInFolder || !allFilesInFolder.length) {
    logMessage("Expected `folderPath` to has at least one file.", true);
  }

  const hashesPromises = allFilesInFolder.map(getFileHash);

  return await Promise.all(hashesPromises);
};

module.exports = getFolderFilesHashSum;
