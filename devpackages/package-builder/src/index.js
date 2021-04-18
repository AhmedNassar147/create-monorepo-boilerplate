/*
 *
 * Index: `@domain/package-builder`.
 *
 */
const { cliOptions } = require("./constants");
const getPaths = require("./getPaths");
const buildPackageFirstTime = require("./buildPackageFirstTime");
const buildPackageWatcher = require("./buildPackageWatcher");
const {
  createCliController,
} = require("../../../internals/command-line-utils");
const invariant = require("../../../internals/scripts/invariant");
const getAllFilesFromFolder = require("../../../internals/scripts/getAllFilesFromFolder");

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
