/*
 *
 * Package: `@domain/validate-app-assets`.
 *
 */
const { join } = require("path");
const chalk = require("chalk");
const {
  scriptName,
  POSSIBLE_MODE_OPTIONS,
  BASE_USED_PACKAGES_WITHOUT_ASSETS_IN_CURRENT_APP,
} = require("./constants");
const getAllPackagesUsedInApp = require("./getAllPackagesUsedInApp");
const getAssetsDiff = require("./getAssetsDiff");
const {
  validatePackagesAssets,
} = require("../../validate-packages-assets/src/validatePackagesAssets");
const {
  PACKAGES_MODULES_REGEX,
  checkPathExists,
  getAllFilesFromFolder,
  getWorkSpacesData,
  getAppPathByModeOrName,
} = require("../../scripts");
const {
  haveAssetsChanged,
  collectAssetsFromPath,
} = require("../../assets-helpers");
const { createCliController } = require("../../command-line-utils");

const logSucceedMessage = () =>
  console.log(`${chalk.magenta(`[${scriptName}]`)} done successfully. ✨✨`);

const generateAppAssets = async ({ appName, mode }) => {
  const { appPath: baseAppFolderPath, appNameWithOutScope } =
    getAppPathByModeOrName({
      appName,
      mode: "production",
    });

  appName = appNameWithOutScope;

  let packagesUsedInCurrentApp = getAllPackagesUsedInApp({
    mode,
    appName,
    scriptName,
  });

  packagesUsedInCurrentApp = packagesUsedInCurrentApp.filter(
    (package) =>
      !BASE_USED_PACKAGES_WITHOUT_ASSETS_IN_CURRENT_APP.includes(package),
  );

  await validatePackagesAssets({
    packages: packagesUsedInCurrentApp,
  });

  const appSrcFolderPath = join(baseAppFolderPath, "src");

  const { error, assetsPaths: assetsUsedInAppSrcFiles } =
    await collectAssetsFromPath({
      pathToCollectAssetsFrom: appSrcFolderPath,
      logInfo: true,
      scriptName,
    });

  if (error) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        "error happened error => " + error,
      )}`,
    );

    process.exit(1);
  }

  const packagesData = getWorkSpacesData({
    onlyTheseWorkSpacesNamesRegex: PACKAGES_MODULES_REGEX,
    packageNamesFilterRegex: new RegExp(packagesUsedInCurrentApp.join("|")),
  });

  const packagesDataKeys = Object.keys(packagesData);

  if (!packagesDataKeys.length) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        "found 0 workspaces packages data",
      )}`,
    );

    process.exit(1);
  }

  const allPackagesAssets = packagesDataKeys
    .map((packageName) => {
      const { assetsPaths } = packagesData[packageName];

      const isAssetsPathsArray = Array.isArray(assetsPaths);

      if (assetsPaths && !isAssetsPathsArray) {
        console.log(
          `${chalk.magenta(`[${scriptName}]`)} ${chalk.keyword("orange")(
            `warning \`assetsPaths\` must be array of strings in package ${packageName} \n` +
              chalk.keyword("orange")(`given ${assetsPaths}`),
          )}`,
        );
      }

      if (isAssetsPathsArray && assetsPaths.length) {
        return assetsPaths;
      }

      return false;
    })
    .flat()
    .filter(Boolean);

  console.log(
    `${chalk.magenta(
      `[${scriptName}]`,
    )} FYI, I searched in the following packages: \n ${chalk.white(
      packagesUsedInCurrentApp.join(" , "),
    )}`,
  );

  const allAssetsUsedByAppAndPackages = Array.from(
    new Set([...allPackagesAssets, ...assetsUsedInAppSrcFiles]),
  ).filter(Boolean);

  const allAssetsUsedByAppAndPackagesLength =
    allAssetsUsedByAppAndPackages.length;

  if (allAssetsUsedByAppAndPackagesLength) {
    const fullPathToAppAssets = join(baseAppFolderPath, "src/assets");
    const isAppAssetsPathExist = await checkPathExists(fullPathToAppAssets);

    const assetsFilesInAppAssetsFolder = (
      isAppAssetsPathExist
        ? await getAllFilesFromFolder(fullPathToAppAssets)
        : []
    ).map((filePath) => filePath.replace(`${fullPathToAppAssets}/`, ""));

    const appAssetsFolderLength = assetsFilesInAppAssetsFolder.length;

    if (appAssetsFolderLength) {
      const isAppAssetsHasCollectedAssets = !haveAssetsChanged(
        allAssetsUsedByAppAndPackages,
        assetsFilesInAppAssetsFolder,
      );

      if (isAppAssetsHasCollectedAssets) {
        console.log(
          `${chalk.magenta(`[${scriptName}]`)} ${chalk.keyword("orange")(
            `Nothing to do, it seems like collected assets from packages / app  are \n` +
              `  the same found in ${fullPathToAppAssets} .`,
          )}`,
        );

        logSucceedMessage();

        process.exit(0);
      }

      console.log(
        `${chalk.magenta(`[${scriptName}]`)} ${chalk.bold.red(
          `Please apply the following in ${fullPathToAppAssets}`,
        )}`,
      );

      console.log(
        "\n",
        ...getAssetsDiff(
          allAssetsUsedByAppAndPackages,
          assetsFilesInAppAssetsFolder,
        ),
      );

      process.exit(1);
    }
  }

  console.log(
    `${chalk.magenta(`[${scriptName}]`)} ${chalk.bold.keyword("orange")(
      `found 0 assets in ${chalk.white(appName)} and it's related packages.`,
    )}`,
  );
  process.exit(0);
};

createCliController({
  scriptName,
  description: "create assets folder for given app based on routes",
  helpersKeys: [
    {
      keyOrKeys: "appName",
      description:
        "if not passed we read it from `.env files` (eg: --appName=some-app-name)",
    },
    {
      keyOrKeys: "mode",
      description: `validate assets based on the environment mode, --mode=${POSSIBLE_MODE_OPTIONS.join(
        " | ",
      )}`,
    },
  ],
  runCliFn: generateAppAssets,
});

// if (foundAssetsLength) {

//   const configPromises = allPackagesAssets.map(async (assetPath) => {

//     const isAssetFoundMainAssetsFolder = await checkPathExists(
//       fullPathToMainAssets,
//     );

//     if (!isAssetFoundMainAssetsFolder) {
//       console.log(
//         `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
//           `couldn't find ${chalk.white(assetPath)} in ` +
//             `${mainAssetsFolderPath}`,
//         )}`,
//       );

//       process.exit(1);
//     }

//     try {
//       const dirNameFromAssets = dirname(assetPath);
//       const isRootDir = dirNameFromAssets === ".";

//       const fullAppAssetsDirs = join(
//         ...(!isRootDir
//           ? [fullPathToAppAssets, dirNameFromAssets]
//           : [fullPathToAppAssets]),
//       );

//       await mkdir(fullAppAssetsDirs, {
//         recursive: true,
//       });

//       await copyFile(
//         fullPathToMainAssets,
//         join(fullPathToAppAssets, assetPath),
//       );
//     } catch (error) {
//       console.log(
//         `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
//           `error when coping files paths when assetPath was ${assetPath}.` +
//             `${error}`,
//         )}`,
//       );
//       process.exit(1);
//     }
//   });

//   await Promise.all(configPromises);
//   logSucceedMessage();
// }
