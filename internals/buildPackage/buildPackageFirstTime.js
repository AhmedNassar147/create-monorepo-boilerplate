/*
 *
 * `buildPackageFirstTime`: `buildPackage`.
 *
 */
const chalk = require("chalk");
const { rm } = require("fs/promises");
const compileFile = require("./compileFile");
const checkPathExists = require("../scripts/checkPathExists");

const buildPackageFirstTime = async ({
  fullPathPackageSrcPath,
  cjsBuildFolder,
  esmBuildFolder,
  filesInSrcFolder,
  force,
  packageName,
}) => {
  const folderExistenceStates = await Promise.all(
    [cjsBuildFolder, esmBuildFolder].map(checkPathExists),
  );

  const areBuildAlreadyDone = folderExistenceStates.every((file) => !!file);

  if (areBuildAlreadyDone && !force) {
    console.log(
      chalk.bold.white(
        `skipping "${packageName}" build, the package already built ` +
          `if you want to force the build process just pass \`--force\`.`,
      ),
    );
    return;
  }

  await Promise.all(
    folderExistenceStates.map(async (folderExist) => {
      if (folderExist) {
        return await rm(folderExist, { recursive: true });
      }

      return await folderExist;
    }),
  );

  const buildFilesPromises = filesInSrcFolder.map(async (filePath) => {
    return Promise.resolve(
      compileFile({
        fileToCompile: filePath,
        fullPathPackageSrcPath,
        cjsBuildFolder,
        esmBuildFolder,
      }),
    );
  });

  await Promise.all(buildFilesPromises);
};

module.exports = buildPackageFirstTime;
