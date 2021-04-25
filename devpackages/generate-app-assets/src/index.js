/*
 *
 * Package: `@domain/generate-app-assets`.
 *
 */
const { copyFile, rmdir, mkdir } = require("fs/promises");
const { join, dirname } = require("path");
const chalk = require("chalk");
const {
  APPS_REGEX,
  PACKAGES_MODULES_REGEX,
} = require("../../../internals/constants");
const invariant = require("../../../internals/scripts/invariant");
const checkPathExists = require("../../../internals/scripts/checkPathExists");
const readJsonFile = require("../../../internals/scripts/readJsonFile");
const createCliController = require("../../../internals/command-line-utils/createCliController");
const getWorkSpacesData = require("../../../internals/workspaces/getWorkSpacesData");

const scriptName = "generate-app-assets";

const POSSIBLE_MODE_OPTIONS = ["production", "development"];
const nameSpaceRegexp = /@\w.+\//;

const generateAppAssets = async ({ appName, mode }) => {
  appName = appName || "app";
  mode = mode || POSSIBLE_MODE_OPTIONS[1];

  if (nameSpaceRegexp.test(appName)) {
    appName = appName.replace(nameSpaceRegexp, "");
  }

  const [isProduction, isDevelopment] = POSSIBLE_MODE_OPTIONS.map(
    (modeOption) => modeOption === mode,
  );

  invariant(
    appName ? APPS_REGEX.test(appName) : true,
    `${chalk.magenta(`[${scriptName}]:`)} ${chalk.red(
      `you have passed the "appName" option with non proper name given appName="${appName}".`,
    )}`,
  );

  if (!(isDevelopment || isProduction)) {
    console.log(
      `${chalk.magenta(`[${scriptName}]:`)} ${chalk.red(
        "requires that you specify the mode option with one of",
      )} ${POSSIBLE_MODE_OPTIONS.join(" , ")} but got ${chalk.bold.white(
        `mode = ${mode}`,
      )}`,
    );
    process.exit(0);
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
          `[${scriptName}]:`,
        )} given the app name ${appName}, the routes config file ` +
          `must be exists couldn't find ${appRoutesJsonConfigFilePath}, ` +
          `maybe there is no app with such name yet ` +
          `or you need to run ${chalk.bold.white(
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
        `[${scriptName}]:`,
      )} found not pages in ${appRoutesJsonConfigFilePath}`,
    );

    process.exit(0);
  }

  allPages = allPages.map((pageData) =>
    pageData.pageIndexPath.replace(nameSpaceRegexp, ""),
  );

  const packagesData = getWorkSpacesData({
    onlyTheseWorkSpacesNamesRegex: PACKAGES_MODULES_REGEX,
    packageNamesFilterRegex: new RegExp(allPages.join("|")),
  });

  const packagesDataKeys = Object.keys(packagesData);

  if (!packagesDataKeys.length) {
    console.log(
      `${chalk.magenta(`[${scriptName}]:`)} ${chalk.keyword("orange")(
        `please checkout ${allPages.join(
          " , ",
        )}. if they have assetsPaths defined with` +
          "array of string if so that means something went wrong.",
      )}`,
    );
    process.exit(0);
  }

  const packagesAssetsPaths = packagesDataKeys.reduce((acc, packageName) => {
    const { assetsPaths } = packagesData[packageName];
    if (assetsPaths && !Array.isArray(assetsPaths)) {
      console.log(
        `${chalk.magenta(`[${scriptName}]:`)} ${chalk.red(
          `\`assetsPaths\` must be array of strings in package ${packageName} given ${assetsPaths}`,
        )}`,
      );
    }
    return [...acc, ...(assetsPaths || [])];
  }, []);

  if (packagesAssetsPaths.length) {
    const configPromises = packagesAssetsPaths.map(async (assetPath) => {
      const fullPathToMainAssets = join(process.cwd(), "assets", assetPath);
      const fullPathToAppAssets = join(process.cwd(), appName, "src/assets");

      try {
        const isAppAssetsPathExist = await checkPathExists(fullPathToAppAssets);
        const dirNameFromAssets = dirname(assetPath);
        const isRootDir = dirNameFromAssets === ".";

        const fullAppAssetsDirs = join(
          ...(!isRootDir
            ? [fullPathToAppAssets, dirNameFromAssets]
            : [fullPathToAppAssets]),
        );

        if (isAppAssetsPathExist) {
          await rmdir(fullPathToAppAssets, { recursive: true });
        }

        await mkdir(fullAppAssetsDirs, {
          recursive: true,
        });

        await copyFile(
          fullPathToMainAssets,
          join(fullPathToAppAssets, assetPath),
        );
      } catch (error) {
        console.log(
          `${chalk.magenta(`[${scriptName}]:`)} ${chalk.red(
            `error when coping files paths when assetPath was ${assetPath}.` +
              `${error}`,
          )}`,
        );
        process.exit(1);
      }
    });

    try {
      await Promise.all(configPromises);
      console.log(
        `${chalk.magenta(`[${scriptName}]:`)} done successfully. ✨✨`,
      );
      process.exit(0);
    } catch (error) {
      console.log(
        `${chalk.magenta(`[${scriptName}]:`)} something went wrong ${error}.`,
      );
      process.exit(1);
    }
  }

  console.log(
    `${chalk.magenta(`[${scriptName}]:`)} ${chalk.keyword("orange")(
      `found 0 assets paths in ${packagesDataKeys.join(" , ")}.`,
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
      description: "pass --appName=some-app-name to create the assets.",
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
