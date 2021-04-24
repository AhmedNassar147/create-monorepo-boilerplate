/*
 *
 * build app routes generator.
 *
 */
const { join, basename, dirname } = require("path");
const createAppPagesRoutesData = require("./createAppPagesRoutesData");
const defineFormatPageRoutePathHelpers = require("./defineFormatPageRoutePathHelpers");
const {
  getAppPagesRoutesDataPath,
  getPathNamesPathInRoutesPackage,
  getGeneratedPagesRoutesPathNamesPath,
} = require("./routesPaths");
const { APPS_REGEX, PROJECT_NAME_SPACE } = require("../../constants");
const invariant = require("../../scripts/invariant");
const collectProcessOptionsSync = require("../../command-line-utils/collectProcessOptionsSync");
const readJsonFileSync = require("../../scripts/readJsonFileSync");
const checkPathExistsSync = require("../../scripts/checkPathExistsSync");
const generateAppsRoutesConfig = require("../../generateAppsRoutesConfig");
const definePlopPrettifyAction = require("../utils/definePlopPrettifyAction");

module.exports = (plop) => {
  const { app: appName } = collectProcessOptionsSync();

  invariant(
    APPS_REGEX.test(appName),
    `\`(build app routes generator)\`: got none proper app name given ${appName}`,
  );

  generateAppsRoutesConfig({
    filter: appName,
  });

  const appRoutesJsonConfigFilePath = join(
    process.cwd(),
    "internals",
    "generateAppsRoutesConfig",
    "generated",
    `${appName}.json`,
  );

  const pagesRoutesFilePathInCurrentApp = getAppPagesRoutesDataPath(appName);
  const pathNamesFilePathInRoutesPackage = getPathNamesPathInRoutesPackage();
  const internalGeneratedPathNamesFilePath = getGeneratedPagesRoutesPathNamesPath();

  invariant(
    checkPathExistsSync(appRoutesJsonConfigFilePath),
    `\`(build app routes generator)\`: couldn't find the app "(${appName})" routes config in` +
      `${appRoutesJsonConfigFilePath}`,
  );

  const { pages, developmentPages } = readJsonFileSync(
    appRoutesJsonConfigFilePath,
    true,
  );

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
};
