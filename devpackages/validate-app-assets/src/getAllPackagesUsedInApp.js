/*
 *
 * `getAllPackagesUsedInApp`: `@domain/validate-app-assets`.
 *
 */
const { join } = require("path");
const chalk = require("chalk");
const {
  POSSIBLE_MODE_OPTIONS,
  BASE_USED_PACKAGES_WITHOUT_ASSETS_IN_CURRENT_APP,
} = require("./constants");
const {
  PACKAGES_MODULES_REGEX,
  APPS_REGEX,
} = require("../../../internals/constants");
const checkPathExistsSync = require("../../../internals/scripts/checkPathExistsSync");
const readJsonFileSync = require("../../../internals/scripts/readJsonFileSync");
const getWorkSpacesData = require("../../../internals/workspaces/getWorkSpacesData");

const getAllPackagesUsedInApp = ({ mode, appName, scriptName }) => {
  scriptName = scriptName || `\`(getAllPackagesUsedInApp):\``;

  if (!APPS_REGEX.test(appName)) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        `received non proper appName given "${appName}".`,
      )}`,
    );

    process.exit(1);
  }

  mode = mode || POSSIBLE_MODE_OPTIONS[1];

  const [isProduction, isDevelopment] = POSSIBLE_MODE_OPTIONS.map(
    (modeOption) => modeOption === mode,
  );

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

  const isAppExist = checkPathExistsSync(join(process.cwd(), appName));

  if (!isAppExist) {
    console.log(
      `${chalk.magenta(`[${scriptName}]`)} ${chalk.red(
        `you have passed the "appName" as "${appName}" but this app does not exist yet.`,
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

  const isAppRoutesDataConfigExists = checkPathExistsSync(
    appRoutesJsonConfigFilePath,
  );

  if (!isAppRoutesDataConfigExists) {
    console.log(
      chalk.red(
        `${chalk.magenta(
          `[${scriptName}]`,
        )} given the app name ${appName}, the routes config file\n` +
          `must be exists, couldn't find ${appRoutesJsonConfigFilePath}, maybe \n` +
          `there is no app with such name yet or you need to run ${chalk.bold.white(
            `yarn generate-routes --app=${appName}`,
          )}`,
      ),
    );

    process.exit(1);
  }

  const { pages, developmentPages } = readJsonFileSync(
    appRoutesJsonConfigFilePath,
    true,
  );

  const allPages = [
    ...(pages || []),
    ...(isProduction ? [] : developmentPages || []),
  ];

  if (!allPages.length) {
    console.log(
      `${chalk.magenta(
        `[${scriptName}]`,
      )} found not pages in ${appRoutesJsonConfigFilePath}`,
    );

    process.exit(1);
  }

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
    process.exit(1);
  }

  const pagesAndTheirDependencies = [
    ...allPages.map((pageData) => pageData.pageIndexPath),
    // `${PROJECT_NAME_SPACE}/base-page`,
  ];
  const alreadyManagedPackages = [
    ...BASE_USED_PACKAGES_WITHOUT_ASSETS_IN_CURRENT_APP,
  ];

  const processPackageDeps = (packageName) => {
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
    const { dependencies } = packageData;

    alreadyManagedPackages.push(packageName);

    let depsArray = Object.keys(dependencies || {});

    if (depsArray.length) {
      depsArray = depsArray.filter(
        (pkg) =>
          // we exclude already mapped packages to avoid circular dependencies search.
          !new RegExp(alreadyManagedPackages.join("|")).test(pkg),
      );

      pagesAndTheirDependencies.push(...depsArray);
    }
  };

  const pagesAndTheirDependenciesLength = pagesAndTheirDependencies.length;
  let index = 0;

  while (index <= pagesAndTheirDependenciesLength) {
    const currentPackageToProcess = pagesAndTheirDependencies[index];

    if (!currentPackageToProcess) {
      break;
    }

    processPackageDeps(currentPackageToProcess);
    ++index;
  }

  return Array.from(
    new Set([
      ...pagesAndTheirDependencies,
      ...BASE_USED_PACKAGES_WITHOUT_ASSETS_IN_CURRENT_APP,
    ]),
  );
};

module.exports = getAllPackagesUsedInApp;
