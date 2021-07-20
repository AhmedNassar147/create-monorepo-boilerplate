/*
 *
 * Package: `@domain/optimize-images`.
 *
 */
const { extname, join } = require("path");
const chalk = require("chalk");
const {
  cliOptions,
  ALLOWED_IMAGES_REGEXP,
  allowedExtensionsString,
} = require("./constants");
const logMessage = require("./logMessage");
const processImageOptimization = require("./processImageOptimization");
const writeDataToManifestFile = require("./writeDataToManifestFile");
const { findRootYarnWorkSpaces } = require("../../scripts");
const { createCliController } = require("../../command-line-utils");
const { getAllFilesFromFolder, checkPathExists } = require("../../scripts");

const optimizeImagesProcessor = async ({ srcPath, width, height }) => {
  const fullSrcPath = srcPath
    ? join(findRootYarnWorkSpaces(), srcPath)
    : srcPath;

  if (!fullSrcPath || !(await checkPathExists(fullSrcPath))) {
    logMessage(`couldn't find the srcPath given \`${srcPath}\``, true);
  }

  await writeDataToManifestFile();

  const imageExt = extname(srcPath);

  if (imageExt) {
    const isGivenSrcIsAllowedImage = ALLOWED_IMAGES_REGEXP.test(imageExt);

    if (!isGivenSrcIsAllowedImage) {
      logMessage(
        `${chalk.red(
          "Opps, we don't support this type just yet",
        )}, allowed extensions \`${chalk.white(
          allowedExtensionsString,
        )}\`, given \`${chalk.magenta(srcPath)}\``,
        true,
        0,
      );
    }

    await processImageOptimization({
      fullImageSrcPath: fullSrcPath,
      width,
      height,
      shouldExitCli: true,
    });

    return;
  }

  const allImagesPaths = (await getAllFilesFromFolder(fullSrcPath)).filter(
    (filePath) => ALLOWED_IMAGES_REGEXP.test(filePath),
  );

  if (!allImagesPaths || !allImagesPaths.length) {
    logMessage(
      `found 0 allowed images to process in \`${chalk.magenta(srcPath)}\``,
      true,
      0,
    );
  }

  const allImagesProcessesPromises = allImagesPaths.map(
    (fullImageSrcPath, index) =>
      processImageOptimization({
        fullImageSrcPath,
        width,
        height,
        shouldExitCli: allImagesPaths.length - 1 === index,
      }),
  );

  await Promise.all(allImagesProcessesPromises);
};

createCliController({
  ...cliOptions,
  runCliFn: optimizeImagesProcessor,
});
