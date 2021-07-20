/*
 *
 * `processImageOptimization`: `@domain/optimize-images`.
 *
 */
const { extname } = require("path");
const { ImagePool } = require("@squoosh/lib");
const chalk = require("chalk");
const logMessage = require("./logMessage");
const getOptimizedAssetsManifestPath = require("./getOptimizedAssetsManifestPath");
const writeAndCalculateImageFileData = require("./writeAndCalculateImageFileData");
const {
  checkPathExists,
  readJsonFile,
  getFilePathBasedOnProjectName,
} = require("../../scripts");

const processImageOptimization = async ({
  fullImageSrcPath,
  width,
  height,
  shouldExitCli,
}) => {
  const assetsManifestPath = getOptimizedAssetsManifestPath();
  const doesManifestExist = await checkPathExists(assetsManifestPath);
  const imageSrcFileInProject = getFilePathBasedOnProjectName(
    fullImageSrcPath,
    true,
  );

  const manifestData = doesManifestExist
    ? (await readJsonFile(assetsManifestPath, true)) || {}
    : {};

  if (Reflect.has(manifestData, imageSrcFileInProject)) {
    const simplifiedManifestPath = getFilePathBasedOnProjectName(
      assetsManifestPath,
      true,
    );

    logMessage(
      chalk.white(
        `skipped, \`${chalk.green(
          imageSrcFileInProject,
        )}\`, (already optimized) \n` +
          `if you want to \`re-optimize\` it, just remove the entry form \`${chalk.magenta(
            simplifiedManifestPath,
          )}\``,
      ),
      shouldExitCli,
      0,
    );

    return;
  }

  const imagePool = new ImagePool();
  try {
    // @see {@link https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh}
    const image = imagePool.ingestImage(fullImageSrcPath);

    await image.decoded;

    logMessage(
      chalk.white(`processing \`${chalk.green(imageSrcFileInProject)}\``),
    );

    const preprocessOptions = {
      quant: {},
    };

    if (width || height) {
      logMessage(
        chalk.green(
          `resize algorithm enabled for \`${imageSrcFileInProject}\``,
        ),
      );

      preprocessOptions.resize = {
        enabled: true,
        ...(width ? { width } : null),
        ...(height ? { height } : null),
      };
    }

    await image.preprocess(preprocessOptions);

    const imageExt = extname(fullImageSrcPath);

    const imageSizeBeforeOptimizationInBytes = (await image.decoded).size;

    const isMozJpeg = /.jpg|.jpeg/.test(imageExt);

    // @see {@link https://github.com/GoogleChromeLabs/squoosh/blob/dev/libsquoosh/src/codecs.ts}
    const encodeMethod = isMozJpeg ? "mozjpeg" : "oxipng";

    await image.encode({
      [encodeMethod]: {},
    });

    const rawEncodedImage = await image.encodedWith[encodeMethod];

    await writeAndCalculateImageFileData({
      rawEncodedImage,
      imageSizeBeforeOptimizationInBytes,
      fullImageSrcPath,
      shouldExitCli,
      imageSrcFileInProject,
    });

    await imagePool.close();
  } catch (error) {
    await imagePool.close();
    logMessage(
      `something went wrong when process the \`${chalk.white(
        imageSrcFileInProject,
      )}\` \n actual error: ${error}`,
      true,
    );
  }
};

module.exports = processImageOptimization;
