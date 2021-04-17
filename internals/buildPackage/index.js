/*
 *
 * Index: `buildPackage`.
 *
 */
const { createCliController } = require("../command-line-utils");
const { cliOptions } = require("./constants");
const getPaths = require("./getPaths");
const invariant = require("../scripts/invariant");
const getAllFilesFromFolder = require("../scripts/getAllFilesFromFolder");
const buildPackageFirstTime = require("./buildPackageFirstTime");
const buildPackageWatcher = require("./buildPackageWatcher");

const runCli = async ({ packageName, watch, force }) => {
  const packagePaths = getPaths(packageName);

  const { fullPathPackageSrcPath } = packagePaths;

  const filesInSrcFolder = await getAllFilesFromFolder(fullPathPackageSrcPath);

  invariant(
    !!filesInSrcFolder.length,
    `can't find files to process in \`${fullPathPackageSrcPath}\`. `,
  );

  if (!watch) {
    await buildPackageFirstTime({
      ...packagePaths,
      filesInSrcFolder,
      force,
      packageName,
    });

    return;
  }

  await buildPackageWatcher({
    ...packagePaths,
    filesInSrcFolder,
  });
};

createCliController({
  runCli,
  ...cliOptions,
  throwIfNoOptionSet: true,
  runCliFn: runCli,
});
