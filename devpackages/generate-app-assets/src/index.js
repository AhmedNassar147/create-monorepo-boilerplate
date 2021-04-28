/*
 *
 * Package: `@domain/generate-app-assets`.
 *
 */
const { copyFile, mkdir } = require("fs/promises");
const { join, dirname } = require("path");
const chalk = require("chalk");
const {
  nameSpaceRegexp,
  scriptName,
  POSSIBLE_MODE_OPTIONS,
} = require("./constants");
const {
  APPS_REGEX,
  PACKAGES_MODULES_REGEX,
  PROJECT_NAME_SPACE,
} = require("../../../internals/constants");
const checkPathExists = require("../../../internals/scripts/checkPathExists");
const readJsonFile = require("../../../internals/scripts/readJsonFile");
const getAllFilesFromFolder = require("../../../internals/scripts/getAllFilesFromFolder");
const createCliController = require("../../../internals/command-line-utils/createCliController");
const getWorkSpacesData = require("../../../internals/workspaces/getWorkSpacesData");
const collectEnvVariablesFromEnvFiles = require("../../../internals/environment/collectEnvVariablesFromEnvFiles");

const logSucceedMessage = () =>
  console.log(`${chalk.magenta(`[${scriptName}]`)} done successfully. ✨✨`);

const generateAppAssets = async ({ appName, mode }) => {
  mode = mode || POSSIBLE_MODE_OPTIONS[1];

  if (!appName) {
    const { APP_NAME } = collectEnvVariablesFromEnvFiles(mode);
    appName = APP_NAME;
  }

  if (nameSpaceRegexp.test(appName)) {
    appName = appName.replace(nameSpaceRegexp, "");
  }

  const [isProduction, isDevelopment] = POSSIBLE_MODE_OPTIONS.map(
    (modeOption) => modeOption === mode,
  );

  if (!APPS_REGEX.test(appName)) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        `you have passed the "appName" option with non proper name given appName="${appName}".`,
      )}`,
    );

    process.exit(1);
  }

  const isAppExist = await checkPathExists(join(process.cwd(), appName));

  if (!isAppExist) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        `you have passed the "appName" as "${appName}" but this app does not exist yet.`,
      )}`,
    );

    process.exit(1);
  }

  if (!(isDevelopment || isProduction)) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        "requires that you specify the mode option with one of",
      )} ${POSSIBLE_MODE_OPTIONS.join(" , ")} but got ${chalk.bold.white(
        `--mode=${mode}`,
      )}`,
    );
    process.exit(1);
  }

  const appRoutesJsonConfigFilePath = join(
    process.cwd(),
    "internals",
    "generateAppsRoutesConfig",
    "generated",
    `${appName}.json`,
  );

  const isAppRoutesDataConfigExists = await checkPathExists(
    appRoutesJsonConfigFilePath,
  );

  if (!isAppRoutesDataConfigExists) {
    console.log(
      chalk.red(
        `${chalk.magenta(
          `[${scriptName}]`,
        )} given the app name ${appName}, the routes config file\n` +
          `must be exists couldn't find ${appRoutesJsonConfigFilePath}, maybe there is \n` +
          `no app with such name yet or you need to run ${chalk.bold.white(
            `yarn generate-app-routes --app=${appName}`,
          )}`,
      ),
    );
    process.exit(0);
  }

  const { pages, developmentPages } = await readJsonFile(
    appRoutesJsonConfigFilePath,
    true,
  );

  let allPages = [
    ...(pages || []),
    ...(isProduction ? [] : developmentPages || []),
  ];

  if (!allPages.length) {
    console.log(
      `${chalk.magenta(
        `[${scriptName}]`,
      )} found not pages in ${appRoutesJsonConfigFilePath}`,
    );

    process.exit(0);
  }

  allPages = allPages.map((pageData) => pageData.pageIndexPath);

  const packagesData = getWorkSpacesData({
    onlyTheseWorkSpacesNamesRegex: PACKAGES_MODULES_REGEX,
  });

  const packagesDataKeys = Object.keys(packagesData);

  if (!packagesDataKeys.length) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        "found 0 workspaces packages data",
      )}`,
    );
    process.exit(0);
  }

  const dependenciesStackToCollectAssetsFrom = [];
  const alreadyManagedPackages = [];
  let allPackagesAssets = [];

  const createAssetsStackAndCollectAppAssets = (packagesName) => {
    packagesName.forEach((packageName) => {
      const packageData = packagesData[packageName];

      if (!packageData) {
        console.log(
          `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
            `couldn't find ${chalk.bold.white(
              packageName,
            )} data from workspaces data.`,
          )}`,
        );

        process.exit(1);
      }

      const { assetsPaths, dependencies } = packageData;

      alreadyManagedPackages.push(packageName);

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
        allPackagesAssets.push(...assetsPaths);
      }

      let depsArray = Object.keys(dependencies || {});

      if (depsArray.length) {
        depsArray = depsArray.filter(
          (pkg) =>
            // we exclude already mapped packages to avoid circular dependencies search.
            !new RegExp(
              [`${PROJECT_NAME_SPACE}/types`, ...alreadyManagedPackages].join(
                "|",
              ),
            ).test(pkg),
        );
        dependenciesStackToCollectAssetsFrom.push(...depsArray);
      }
    });
  };

  createAssetsStackAndCollectAppAssets(allPages);

  const dependenciesHaveAssetsLength =
    dependenciesStackToCollectAssetsFrom.length;

  while (dependenciesHaveAssetsLength) {
    const currentPackageToProcess = dependenciesStackToCollectAssetsFrom.splice(
      0,
      1,
    )[0];

    if (!currentPackageToProcess) {
      break;
    }
    createAssetsStackAndCollectAppAssets([currentPackageToProcess]);
  }

  // remove duplicated assets paths.
  allPackagesAssets = Array.from(new Set(allPackagesAssets));

  const foundAssetsLength = allPackagesAssets.length;

  console.log(
    `${chalk.magenta(
      `[${scriptName}]`,
    )} FYI, I searched in the following packages: \n ${chalk.white(
      alreadyManagedPackages.join(" , "),
    )}`,
  );

  console.log(
    `${chalk.magenta(`[${scriptName}]`)} ${chalk.keyword("orange")(
      `found ${foundAssetsLength} assets`,
    )}`,
  );

  if (foundAssetsLength) {
    const fullPathToAppAssets = join(process.cwd(), appName, "src/assets");
    const isAppAssetsPathExist = await checkPathExists(fullPathToAppAssets);

    const assetsFilesInAppAssetsFolder = (isAppAssetsPathExist
      ? await getAllFilesFromFolder(fullPathToAppAssets)
      : []
    ).map((filePath) => filePath.replace(`${fullPathToAppAssets}/`, ""));
    const appAssetsFolderLength = assetsFilesInAppAssetsFolder.length;

    if (appAssetsFolderLength) {
      const [assetsFilesInAppAssetsFolderString, allPackagesAssetsString] = [
        assetsFilesInAppAssetsFolder,
        allPackagesAssets,
      ].map((assetsArray) => JSON.stringify(assetsArray.sort()));

      let isAppAssetsHasCollectedAssets =
        assetsFilesInAppAssetsFolderString === allPackagesAssetsString;

      if (!isAppAssetsHasCollectedAssets) {
        isAppAssetsHasCollectedAssets = allPackagesAssets.every((assetPath) =>
          assetsFilesInAppAssetsFolder.includes(assetPath),
        );
      }

      if (isAppAssetsHasCollectedAssets) {
        console.log(
          `${chalk.magenta(`[${scriptName}]`)} ${chalk.keyword("orange")(
            `nothing to do, it seems like collected assets from packages are the same \n` +
              `  with assets found in ${fullPathToAppAssets}`,
          )}`,
        );
        logSucceedMessage();
        process.exit(0);
      }
    }

    const configPromises = allPackagesAssets.map(async (assetPath) => {
      const mainAssetsFolderPath = join(process.cwd(), "assets");
      const fullPathToMainAssets = join(mainAssetsFolderPath, assetPath);

      const isAssetFoundMainAssetsFolder = await checkPathExists(
        fullPathToMainAssets,
      );

      if (!isAssetFoundMainAssetsFolder) {
        console.log(
          `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
            `couldn't find ${chalk.white(assetPath)} in ` +
              `${mainAssetsFolderPath}`,
          )}`,
        );

        process.exit(1);
      }

      try {
        const dirNameFromAssets = dirname(assetPath);
        const isRootDir = dirNameFromAssets === ".";

        const fullAppAssetsDirs = join(
          ...(!isRootDir
            ? [fullPathToAppAssets, dirNameFromAssets]
            : [fullPathToAppAssets]),
        );

        await mkdir(fullAppAssetsDirs, {
          recursive: true,
        });

        await copyFile(
          fullPathToMainAssets,
          join(fullPathToAppAssets, assetPath),
        );
      } catch (error) {
        console.log(
          `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
            `error when coping files paths when assetPath was ${assetPath}.` +
              `${error}`,
          )}`,
        );
        process.exit(1);
      }
    });

    await Promise.all(configPromises);
    logSucceedMessage();
  }

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
      description:
        `create assets based on the mode if production we include only production assets ` +
        `else all of them --mode=${POSSIBLE_MODE_OPTIONS.join(" | ")} ` +
        "to create the assets .",
    },
  ],
  runCliFn: generateAppAssets,
});
