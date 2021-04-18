/*
 *
 * `buildPackageWatcher`: `@domain/package-builder`.
 *
 */
"use strict";
const chalk = require("chalk");
const { unlink, rename } = require("fs/promises");
const path = require("path");
const getFilesContentsHash = require("./getFilesContentsHash");
const getFileMd5 = require("./getFileMd5");
const compileFile = require("./compileFile");
const getOutDirAndCreateIfNotExists = require("./getOutDirAndCreateIfNotExists");
const getDirNameFromPath = require("../../../internals/scripts/getDirNameFromPath");
const checkPathExists = require("../../../internals/scripts/checkPathExists");
const createWatcher = require("../../../internals/scripts/createWatcher");

const watchingEvents = ["unlink", "add", "change"];

const defaultFileHashData = {
  fileHash: "",
  hasContent: false,
};

const buildPackageWatcher = async ({
  fullPathPackageSrcPath,
  cjsBuildFolder,
  esmBuildFolder,
  filesInSrcFolder,
}) => {
  const previousFilesHashMap = await getFilesContentsHash(filesInSrcFolder);

  const selectFilePathFormHashMapByHash = (hashSearch) => {
    let selectedFilePath = "";

    Array.from(previousFilesHashMap).forEach(([key, { fileHash }]) => {
      if (fileHash === hashSearch) {
        selectedFilePath = key;
      }
    });

    return selectedFilePath;
  };

  const handleRemoveFile = async ({
    currentChangedFile,
    dirOfCurrentFile,
    fileName,
  }) => {
    try {
      previousFilesHashMap.delete(currentChangedFile);
      const fileInBuildFolders = [
        cjsBuildFolder,
        esmBuildFolder,
      ].map((buildFolder) =>
        path.join(buildFolder, dirOfCurrentFile, fileName),
      );

      const fileExistenceStatus = (
        await Promise.all(fileInBuildFolders.map(checkPathExists))
      ).filter(Boolean);

      if (fileExistenceStatus.length) {
        await Promise.all(fileExistenceStatus.map(unlink));
      }
    } catch (error) {
      console.log(chalk.red(`[handleRemoveFile]: Error => ${error}`));
    }
  };

  const handleAddFile = async ({
    currentChangedFile,
    dirOfCurrentFile,
    fileName,
    hasContent,
    fileHash,
  }) => {
    try {
      // developer could rename or add the file.
      // we need to know if a developer is copying / renaming the file.
      // we select the file name for the map by hash
      // then we check if the selected file path is still exists
      // if true that means the developer is coping otherwise renaming.

      // developer is creating or renaming file (with no content)
      if (!hasContent) {
        return;
      }
      // if the selected file has value that means developer is coping the file.
      // from current package.
      const selectedFilePath = selectFilePathFormHashMapByHash(fileHash);

      // we check if the selected file still exists
      const isDeveloperCopingFile = selectedFilePath
        ? await checkPathExists(selectedFilePath)
        : false;

      // developer is coping the file.
      // we wait the changes to compile (giving developer much more time).
      const isDeveloperCopingFileOutSideTheCurrentPackage =
        !isDeveloperCopingFile && !selectedFilePath;

      if (
        isDeveloperCopingFile ||
        isDeveloperCopingFileOutSideTheCurrentPackage
      ) {
        return;
      }

      previousFilesHashMap.add(currentChangedFile, {
        fileHash,
        hasContent,
      });

      // developer is renaming the file.
      if (!isDeveloperCopingFile && selectedFilePath) {
        // prepare the build folders.
        const buildConfig = await getOutDirAndCreateIfNotExists({
          dirOfCurrentFile,
          cjsBuildFolder,
          esmBuildFolder,
        });

        const previousFileName = path.basename(selectedFilePath);

        // we copy the previous complied code to their new paths in build folder.
        await Promise.all(
          buildConfig.map(async (config) => {
            return rename(
              path.join(config.dir, previousFileName),
              path.join(config.dir, fileName),
            );
          }),
        );
      }
    } catch (error) {
      console.log(chalk.red(`[handleAddFile]: Error => ${error}`));
    }
  };

  const handleWatcherEvents = async (eventName, currentChangedFile) => {
    try {
      // when rename file events will fire twice one for adding other for removing.
      const [
        isRemovingFile,
        isAddingNewFile,
        isChangingFile,
      ] = watchingEvents.map((event) => event === eventName);

      const fileName = path.basename(currentChangedFile);

      const dirOfCurrentFile = await getDirNameFromPath(
        currentChangedFile,
        fullPathPackageSrcPath,
      );

      if (isRemovingFile) {
        await handleRemoveFile({
          currentChangedFile,
          dirOfCurrentFile,
          fileName,
        });

        return;
      }

      const { fileHash, hasContent } = await getFileMd5(currentChangedFile);

      if (isAddingNewFile) {
        await handleAddFile({
          currentChangedFile,
          dirOfCurrentFile,
          fileName,
          hasContent,
          fileHash,
        });
        return;
      }

      if (isChangingFile) {
        const wasCurrentFileExist = previousFilesHashMap.has(
          currentChangedFile,
        );
        const { fileHash: previousFileHash } = wasCurrentFileExist
          ? previousFilesHashMap.get(currentChangedFile)
          : defaultFileHashData;

        const isPreviousHashEqualCurrent = previousFileHash === fileHash;

        if (!isPreviousHashEqualCurrent && hasContent) {
          try {
            await compileFile({
              fileToCompile: currentChangedFile,
              fullPathPackageSrcPath,
              cjsBuildFolder,
              esmBuildFolder,
            });

            previousFilesHashMap.set(currentChangedFile, {
              fileHash,
              hasContent,
            });
          } catch (error) {
            console.log(
              chalk.red(
                `Error [when compiling content for ${currentChangedFile}]: ${error}`,
              ),
            );
          }
        }
      }
    } catch (err) {
      console.log(chalk.red(`[watcher]: Error => ${err}`));
    }
  };

  createWatcher(fullPathPackageSrcPath, handleWatcherEvents, watchingEvents);
};

module.exports = buildPackageWatcher;
