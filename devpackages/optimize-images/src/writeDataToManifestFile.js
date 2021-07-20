/*
 *
 * `writeDataToManifestFile`: `@domain/optimize-images`.
 *
 */
const { writeFile } = require("fs/promises");
const chalk = require("chalk");
const getOptimizedAssetsManifestPath = require("./getOptimizedAssetsManifestPath");
const logMessage = require("./logMessage");
const {
  checkPathExists,
  getFilePathBasedOnProjectName,
} = require("../../scripts");

const writeDataToManifestFile = async (
  manifestData,
  forceWriteTheManifestIfExists,
) => {
  const assetsManifestPath = getOptimizedAssetsManifestPath();
  const doesManifestExist = await checkPathExists(assetsManifestPath);

  if (!doesManifestExist || forceWriteTheManifestIfExists) {
    await writeFile(assetsManifestPath, JSON.stringify(manifestData || {}), {
      encoding: "utf8",
    });

    const simplifiedManifestPath = getFilePathBasedOnProjectName(
      assetsManifestPath,
      true,
    );

    logMessage(
      chalk.white(
        `FYI, just ${
          forceWriteTheManifestIfExists ? "updated" : "created"
        } \`${chalk.cyan(simplifiedManifestPath)}\` ${
          forceWriteTheManifestIfExists ? "with new entry" : ""
        }.`,
      ),
    );
  }
};

module.exports = writeDataToManifestFile;
