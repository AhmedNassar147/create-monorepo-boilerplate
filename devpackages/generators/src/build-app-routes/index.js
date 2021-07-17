/*
 *
 * build app routes generator.
 *
 */
const { join, basename, dirname } = require("path");
const chalk = require("chalk");
const createAppPagesRoutesData = require("./createAppPagesRoutesData");
const defineFormatPageRoutePathHelpers = require("./defineFormatPageRoutePathHelpers");
const {
  getAppPagesRoutesDataPath,
  getPathNamesPathInRoutesPackage,
} = require("./routesPaths");
const generateAppsRoutesConfig = require("./generateAppsRoutesConfig");
const definePlopPrettifyAction = require("../utils/definePlopPrettifyAction");
const defineRemoveAtHelper = require("../utils/defineRemoveAtHelper");
const { collectProcessOptionsSync } = require("../../../command-line-utils");
const {
  APPS_REGEX,
  PROJECT_NAME_SPACE,
  readJsonFileSync,
  checkPathExistsSync,
  getGeneratedRoutesFilePath,
  getWorksSpacesOnlyNamesSync,
  findRootYarnWorkSpaces,
} = require("../../../scripts");

const createErrorMessage = (msg) => {
  console.log(chalk.white("[build app routes generator]: ") + chalk.red(msg));
  process.exit(1);
};

module.exports = (plop) => {
  let { app: appName } = collectProcessOptionsSync();

  appName = appName || "app";

  if (!APPS_REGEX.test(appName)) {
    createErrorMessage(
      `got none proper app name given "${appName}", the name should end with "${chalk.magenta(
        "-app",
      )}"`,
    );
  }

  const allRegisteredApps = getWorksSpacesOnlyNamesSync(APPS_REGEX);

  if (!allRegisteredApps.includes(appName)) {
    createErrorMessage(
      `please provide an existing app given "${appName}" \n` +
        chalk.magenta(`Existing apps are : ${allRegisteredApps.join(" , ")}`),
    );
  }

  generateAppsRoutesConfig({
    filter: appName,
  });

  const appRoutesJsonConfigFilePath = getGeneratedRoutesFilePath(
    `${appName}.json`,
  );

  const appInternalRoutesConfig = join(
    findRootYarnWorkSpaces(),
    appName,
    "internal-routes-config.json",
  );

  const pagesRoutesFilePathInCurrentApp = getAppPagesRoutesDataPath(appName);
  const pathNamesFilePathInRoutesPackage = getPathNamesPathInRoutesPackage();
  const internalGeneratedPathNamesFilePath = getGeneratedRoutesFilePath(
    "pagesPathNames.json",
  );

  const isAppRoutesJsonConfigFileExists = checkPathExistsSync(
    appRoutesJsonConfigFilePath,
  );
  const isInternalAppRoutesJsonConfigFileExists = checkPathExistsSync(
    appInternalRoutesConfig,
  );

  if (
    !(
      isAppRoutesJsonConfigFileExists || isInternalAppRoutesJsonConfigFileExists
    )
  ) {
    createErrorMessage(
      `couldn't find the app "(${appName})" routes config in ` +
        `${appRoutesJsonConfigFilePath} or ${appInternalRoutesConfig}`,
    );
  }

  let pages = [];
  let developmentPages = [];

  [
    isAppRoutesJsonConfigFileExists,
    isInternalAppRoutesJsonConfigFileExists,
  ].forEach((filePathIfExist) => {
    if (filePathIfExist) {
      const configData = readJsonFileSync(filePathIfExist, true);

      if (configData.pages) {
        pages.push(...configData.pages);
      }
      if (configData.developmentPages) {
        pages.push(...configData.developmentPages);
      }
    }
  });

  pages = pages.filter(Boolean);
  developmentPages = developmentPages.filter(Boolean);

  const [
    { routerPagesData: pagesRouterData, pathNames: pagesPathNames },
    { routerPagesData: devPagesRouterData, pathNames: devPagesPathNames },
  ] = [pages, developmentPages].map(createAppPagesRoutesData);

  const isGeneratedPathNamesFileExists = checkPathExistsSync(
    internalGeneratedPathNamesFilePath,
  );

  const previousPathNames = !isGeneratedPathNamesFileExists
    ? {}
    : readJsonFileSync(internalGeneratedPathNamesFilePath, true);

  const newPathNames = JSON.stringify({
    ...previousPathNames,
    ...pagesPathNames,
    ...devPagesPathNames,
  });

  const getPrettifyPaths = (filePath) => ({
    containingFolderPath: dirname(filePath),
    folderOrFileName: basename(filePath),
    noGlob: true,
  });

  plop.setGenerator("app routes generator", {
    description: "generate App routes data",
    prompts: [],
    actions: [
      {
        type: "add",
        path: internalGeneratedPathNamesFilePath,
        templateFile: "./templates/internals.generated.pathNames.json.hbs",
        abortOnFail: true,
        force: true,
        data: {
          newPathNames,
        },
      },
      {
        type: "add",
        path: pathNamesFilePathInRoutesPackage,
        templateFile: "./templates/pagesPathNames.ts.hbs",
        abortOnFail: true,
        force: true,
        data: {
          newPathNames,
          PROJECT_NAME_SPACE,
        },
      },
      {
        type: "add",
        path: pagesRoutesFilePathInCurrentApp,
        templateFile: "./templates/pagesRoutesData.ts.hbs",
        abortOnFail: true,
        force: true,
        data: {
          appName,
          PROJECT_NAME_SPACE,
          pagesRouterData: pagesRouterData.length ? pagesRouterData : false,
          devPagesRouterData: devPagesRouterData.length
            ? devPagesRouterData
            : false,
        },
      },
      {
        type: "prettify",
        data: getPrettifyPaths(internalGeneratedPathNamesFilePath),
        abortOnFail: true,
      },
      {
        type: "prettify",
        data: getPrettifyPaths(pathNamesFilePathInRoutesPackage),
        abortOnFail: true,
      },
      {
        type: "prettify",
        data: getPrettifyPaths(pagesRoutesFilePathInCurrentApp),
        abortOnFail: true,
      },
    ],
  });

  defineFormatPageRoutePathHelpers(plop);
  definePlopPrettifyAction(plop);
  defineRemoveAtHelper(plop);
};
