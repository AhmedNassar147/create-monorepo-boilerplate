/*
 *
 * `getAppPathByModeOrName`: `@domain/scripts`.
 *
 */
const { join } = require("path");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");
const getPackageNameFromScopedPackage = require("./getPackageNameFromScopedPackage");

const getAppPathByModeOrName = ({ appName, mode }) => {
  if (!appName) {
    const { APP_NAME } =
      require("../../environment/src/collectEnvVariablesFromEnvFiles")(
        mode || "development",
      );
    appName = APP_NAME;
  }

  appName = getPackageNameFromScopedPackage(appName);

  const appPath = join(findRootYarnWorkSpaces(), appName);

  return { appPath, appNameWithOutScope: appName };
};

module.exports = getAppPathByModeOrName;
