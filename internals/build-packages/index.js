/*
 *
 * Index: `build-packages`.
 *
 */
const vite = require("vite");
const debouncedWatch = require("../scripts/debouncedWatch");
const getWorkSpacesData = require("../scripts/getWorkSpacesData");
const invariant = require("../scripts/invariant");
const throwIfCurrentRootIsNotExist = require("../scripts/throwIfCurrentRootIsNotExist");
const getPackageNameAndExcludeNameSpace = require("../scripts/getPackageNameAndExcludeNameSpace");
const { createCliController } = require("../command-line-utils");
const { cliOptions } = require("./constants");

const runCli = async ({ filter, workspace }) => {
  throwIfCurrentRootIsNotExist(workspace, true);

  let packagesInCurrentWorkSpace = getWorkSpacesData({
    onlyTheseWorkSpacesNames: [workspace],
  });

  if (filter) {
    filter = getPackageNameAndExcludeNameSpace(filter);
    filter = filter.replace(/\//g, "");

    const packagesFromFilterRegex = new RegExp(`${filter}`);

    packagesInCurrentWorkSpace = Object.keys(packagesInCurrentWorkSpace).reduce(
      (acc, packageName) => {
        const onlyPackageName = getPackageNameAndExcludeNameSpace(packageName);
        if (packagesFromFilterRegex.test(onlyPackageName)) {
          acc[packageName] = packagesInCurrentWorkSpace[packageName];
        }
        return acc;
      },
      {},
    );
  }

  const packagesKeys = Object.keys(packagesInCurrentWorkSpace);
  const noPackagesToBuild = packagesKeys.length === 0;

  if (noPackagesToBuild) {
    invariant(!noPackagesToBuild, "0 packages found to be built ");
    process.exit(1);
  }

  packagesKeys.map(async (packageName) => {
    const absolutePackagePath = packagesInCurrentWorkSpace[packageName];
    const srcDirectory = `${absolutePackagePath}/src`;

    await debouncedWatch({
      fileOrDirectoryPath: srcDirectory,
      callback: async () => {
        try {
          process.env.PACKAGE_BUILDER_ROOT = absolutePackagePath;
          process.env.PACKAGE_BUILDER_LIB_NAME = packageName;

          await vite.build({
            configFile: "./internals/build-packages/buildPackage.js",
          });
        } catch (error) {
          console.log("error when running bite build", error);
        }
      },
    });
  });
};

createCliController({
  ...cliOptions,
  throwIfNoOptionSet: true,
  runCliFn: runCli,
});
