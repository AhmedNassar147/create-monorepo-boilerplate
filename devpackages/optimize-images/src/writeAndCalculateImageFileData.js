/*
 *
 * `writeAndCalculateImageFileData`: `@domain/optimize-images`.
 *
 */
const { writeFile } = require("fs/promises");
const chalk = require("chalk");
const writeDataToManifestFile = require("./writeDataToManifestFile");
const logMessage = require("./logMessage");
const getOptimizedAssetsManifestPath = require("./getOptimizedAssetsManifestPath");
const { checkPathExists, readJsonFile } = require("../../scripts");

const writeAndCalculateImageFileData = async ({
  imageSizeBeforeOptimizationInBytes,
  fullImageSrcPath,
  rawEncodedImage,
  shouldExitCli,
  imageSrcFileInProject,
}) => {
  const extension = rawEncodedImage.extension;
  const imageSizeAfterOptimizationInBytes = rawEncodedImage.size;
  const imageBinary = (await rawEncodedImage).binary;

  await writeFile(fullImageSrcPath, imageBinary, {
    encoding: "binary",
  });

  const diffInBytes =
    imageSizeBeforeOptimizationInBytes - imageSizeAfterOptimizationInBytes;
  const diffPercentage = Math.floor(
    (diffInBytes / imageSizeBeforeOptimizationInBytes) * 100,
  );

  const assetsManifestPath = getOptimizedAssetsManifestPath();
  const doesManifestExist = await checkPathExists(assetsManifestPath);

  const manifestData = doesManifestExist
    ? (await readJsonFile(assetsManifestPath, true)) || {}
    : {};

  await writeDataToManifestFile(
    {
      ...manifestData,
      [imageSrcFileInProject]: {
        imageSizeBeforeOptimizationInBytes: imageSizeBeforeOptimizationInBytes,
        imageSizeAfterOptimizationInBytes: imageSizeAfterOptimizationInBytes,
        diffInBytes: diffInBytes,
        diffPercentage: `${diffPercentage}%`,
        extensionAfterOptimization: extension,
      },
    },
    true,
  );

  logMessage(
    chalk.white(`processing \`${chalk.green(imageSrcFileInProject)}\` done.`),
    !!shouldExitCli,
    0,
  );
};

module.exports = writeAndCalculateImageFileData;
