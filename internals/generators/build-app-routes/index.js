/*
 *
 * build app routes generator.
 *
 */
const { join, basename, dirname } = require("path");
const { APPS_REGEX, PROJECT_NAME_SPACE } = require("../../constants/base");
const invariant = require("../../scripts/invariant");
const collectProcessOptionsSync = require("../../command-line-utils/collectProcessOptionsSync");
const readJsonFileSync = require("../../scripts/readJsonFileSync");
const checkPathExistsSync = require("../../scripts/checkPathExistsSync");
const createAppPagesRoutesData = require("./createAppPagesRoutesData");
const defineFormatPageRoutePathHelpers = require("./defineFormatPageRoutePathHelpers");
const definePlopPrettifyAction = require("../utils/definePlopPrettifyAction");
const generateAppsRoutesConfig = require("../../generateAppsRoutesConfig");
const {
  getAppGeneratedPagesRoutesDataPath,
  getPagesRoutesPathNamesPath,
} = require("./routesPaths");

module.exports = (plop) => {
  const { app: appName } = collectProcessOptionsSync();

  invariant(
    APPS_REGEX.test(appName),
    `\`(build app routes generator)\`: got non proper app name given ${appName}`,
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

  invariant(
    checkPathExistsSync(appRoutesJsonConfigFilePath),
    `\`(build app routes generator)\`: couldn't find the app "(${appName})" routes config in` +
      `${appRoutesJsonConfigFilePath}`,
  );

  const pagesRoutesFilePathInCurrentApp = getAppGeneratedPagesRoutesDataPath(
    appName,
  );
  const pathNamesFilePathInRoutesPackage = getPagesRoutesPathNamesPath();

  const { pages, developmentPages } = readJsonFileSync(
    appRoutesJsonConfigFilePath,
    true,
  );

  const [
    { routerPagesData: pagesRouterData, pathNames: pagesPathNames },
    { routerPagesData: devPagesRouterData, pathNames: devPagesPathNames },
  ] = [pages, developmentPages].map(createAppPagesRoutesData);

  const isGeneratedPathNamesFileExists = checkPathExistsSync(
    pathNamesFilePathInRoutesPackage,
  );

  const previousPathNames = !isGeneratedPathNamesFileExists
    ? {}
    : readJsonFileSync(pathNamesFilePathInRoutesPackage, true);

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
        path: pathNamesFilePathInRoutesPackage,
        templateFile: "./templates/pagesPathNames.json.hbs",
        abortOnFail: true,
        force: true,
        data: {
          newPathNames: JSON.stringify({
            ...previousPathNames,
            ...pagesPathNames,
            ...devPagesPathNames,
          }),
        },
      },
      {
        type: "add",
        path: pagesRoutesFilePathInCurrentApp,
        templateFile: "./templates/pagesRoutesData.ts.hbs",
        abortOnFail: true,
        force: true,
        data: {
          PROJECT_NAME_SPACE,
          pagesRouterData: pagesRouterData.length ? pagesRouterData : false,
          devPagesRouterData: devPagesRouterData.length
            ? devPagesRouterData
            : false,
        },
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
