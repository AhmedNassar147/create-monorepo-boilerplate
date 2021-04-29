/*
 *
 * `collectAssetsFromPath`: `assetsHelpers`.
 *
 */
const { extname } = require("path");
const { readFile } = require("fs/promises");
const chalk = require("chalk");
const { validFilesRegexp, assetsPathsRegexp } = require("./constants");
const replaceAssetAndSlashFromArray = require("./replaceAssetAndSlashFromArray");
const getAllFilesFromFolder = require("../scripts/getAllFilesFromFolder");
const checkPathExists = require("../scripts/checkPathExists");

const collectAssetsFromPath = async ({
  pathToCollectAssetsFrom,
  onlyTheseExtensionsRegex,
  logInfo = true,
  scriptName,
}) => {
  let results = {
    error: "",
    assetsPaths: [],
  };

  const isPathExits = await checkPathExists(pathToCollectAssetsFrom);

  if (!isPathExits) {
    results.error = `you have provide not existing path ${pathToCollectAssetsFrom}.`;

    return results;
  }

  const isAssetsPathFile = !!extname(pathToCollectAssetsFrom);

  onlyTheseExtensionsRegex = onlyTheseExtensionsRegex || validFilesRegexp.ALL;

  let validFilesToProcess = (isAssetsPathFile
    ? [pathToCollectAssetsFrom]
    : await getAllFilesFromFolder(pathToCollectAssetsFrom)
  ).filter((filePath) => onlyTheseExtensionsRegex.test(filePath));

  if (!validFilesToProcess.length) {
    if (logInfo) {
      console.log(
        `${chalk.magenta(`[${scriptName}]`)} ${chalk.keyword("orange")(
          `skipping "${pathToCollectAssetsFrom}" \n` +
            `it doesn't have files ends with ${onlyTheseExtensionsRegex}`,
        )}`,
      );
    }

    return results;
  }

  const filesConfigPromises = validFilesToProcess.map(async (filePath) => {
    const fileSourceString = await readFile(filePath, { encoding: "utf8" });

    if (logInfo) {
      console.log(
        `${chalk.magenta(`[${scriptName}] processing`)} ${chalk.bold.white(
          filePath,
        )}`,
      );
    }

    if (fileSourceString) {
      return fileSourceString.match(assetsPathsRegexp);
    }

    return false;
  });

  try {
    let result = (await Promise.all(filesConfigPromises))
      .flat()
      .filter(Boolean);

    const resultLength = result.length;

    if (resultLength) {
      result = replaceAssetAndSlashFromArray(Array.from(new Set(result)));
    }

    results.assetsPaths = result.filter(Boolean);
  } catch (error) {
    results.assetsPaths = [];
    results.error = error
      ? typeof error === "object"
        ? JSON.stringify(error)
        : error
      : "something went wrong";
  }

  return results;
};

module.exports = collectAssetsFromPath;
