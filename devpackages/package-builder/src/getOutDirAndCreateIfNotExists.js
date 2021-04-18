/*
 *
 * `getOutDirAndCreateIfNotExists`: `@domain/package-builder`.
 *
 */
const path = require("path");
const { mkdir } = require("fs/promises");
const checkPathExists = require("../../../internals/scripts/checkPathExists");

const getOutDirAndCreateIfNotExists = async ({
  dirOfCurrentFile,
  cjsBuildFolder,
  esmBuildFolder,
}) => {
  const distFolders = [esmBuildFolder, cjsBuildFolder];
  const isFileInRootSrc = dirOfCurrentFile === "/";

  const configPromises = distFolders.map(async (distFolderPath, index) => {
    const outDirPath = isFileInRootSrc
      ? distFolderPath
      : path.join(distFolderPath, dirOfCurrentFile);

    const isDistFolderPathExist = await checkPathExists(outDirPath);

    if (!isDistFolderPathExist) {
      await mkdir(outDirPath, { recursive: true });
    }

    return {
      dir: outDirPath,
      isEsModules: !index,
    };
  });

  return await Promise.all(configPromises);
};

module.exports = getOutDirAndCreateIfNotExists;
