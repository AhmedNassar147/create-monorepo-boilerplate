/*
 *
 * `restorePackageBuildFromCache`: `@domain/rollup-build-cache-plugin`.
 *
 */
const path = require("path");
const { unlink, stat, rmdir } = require("fs/promises");
const chalk = require("chalk");
const getPackageCacheDirectory = require("./getPackageCacheDirectory");
const {
  copyDirectory,
  getAllFilesFromFolder,
  getFilePathBasedOnProjectName,
} = require("../../scripts");

const restorePackageBuildFromCache = async (
  packageHashSum,
  absolutePackagePath,
  absolutePackageBuildDirectory,
  displayPackageCacheDirectory,
) => {
  const packageCacheDirectory = getPackageCacheDirectory(
    packageHashSum,
    absolutePackagePath,
  );

  const packageBuildDirectory = path.basename(absolutePackageBuildDirectory);

  const source = path.join(packageCacheDirectory, packageBuildDirectory);

  const copyFilesToDestDirPromise = copyDirectory(
    source,
    absolutePackageBuildDirectory,
  );

  const getFilesInDestDir = async () => {
    try {
      await stat(absolutePackageBuildDirectory);
      return await getAllFilesFromFolder(absolutePackageBuildDirectory);
    } catch (_) {
      return Promise.resolve([]);
    }
  };

  const [filesInDestinationDir, filesCopiedFromCacheToDestinationDir] =
    await Promise.all([getFilesInDestDir(), copyFilesToDestDirPromise]);

  const filesOrDirsToRemoveFromDestinationDir = filesInDestinationDir.filter(
    (fileInDestinationDir) =>
      !filesCopiedFromCacheToDestinationDir.includes(fileInDestinationDir),
  );

  if (filesOrDirsToRemoveFromDestinationDir.length) {
    await Promise.all(
      filesOrDirsToRemoveFromDestinationDir.map(async (fileOrDirToUnlink) => {
        let fileOrDirToUnlinkStats;

        try {
          fileOrDirToUnlinkStats = await stat(fileOrDirToUnlink);

          if (fileOrDirToUnlinkStats.isDirectory()) {
            await rmdir(fileOrDirToUnlink, { recursive: true });
          } else {
            await unlink(fileOrDirToUnlink);
          }
        } catch (unlinkOrRmdirError) {
          try {
            await stat(fileOrDirToUnlink);
            // The file/directory still exists, it was not deleted by another
            // process, there must be some other problem; throw.
            throw unlinkOrRmdirError;
          } catch (statError) {
            // It's possible for two `rollup` processes building or build watching
            // the same package, to be running at the same time. In that case one
            // of the processes may unlink a file just before the other; it'
            // rare but not impossible. In such case, don't crash.
            console.log(
              chalk.red(
                `Couldn't delete (another process just deleted it): ` +
                  `${fileOrDirToUnlink}.`,
              ),
            );
          }
        }
      }),
    );
  }

  const displayPackageBuildDirectory = chalk.bold(
    `${getFilePathBasedOnProjectName(absolutePackageBuildDirectory, true)}`,
  );

  console.log(
    chalk.bold.green(
      `Cache restored (${displayPackageCacheDirectory}): ${displayPackageBuildDirectory}`,
    ),
  );

  return filesCopiedFromCacheToDestinationDir;
};

module.exports = restorePackageBuildFromCache;
