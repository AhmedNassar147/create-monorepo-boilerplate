/*
 *
 * `getWorkSpacesData`: `scripts`.
 *
 */
const chalk = require("chalk");
const { readdirSync } = require("fs");
const path = require("path");
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");
const readJsonFileSync = require("../scripts/readJsonFileSync");
const checkPathExistsSync = require("../scripts/checkPathExistsSync");
const invariant = require("../scripts/invariant");
const { APPS_REGEX } = require("../constants");

const PKG_JSON_EXT = "package.json";

const createFoundEmptyWorkSpaceMsg = (workspace) => {
  return chalk.red(
    `Found an empty workspace ${chalk.bold.magenta(workspace)} ` +
      "please remove it or add a package to it.",
  );
};

const getWorkSpacesData = (options) => {
  const {
    withFileSrcPath,
    onlyTheseWorkSpacesNamesRegex,
    onlyPages,
    packageNamesFilterRegex,
  } = options || {};

  const projectRoot = findRootYarnWorkSpaces();

  invariant(
    projectRoot,
    `\`(getWorkSpacesData)\`: couldn't find root workspaces path.`,
  );

  const workspaces = getWorksSpacesOnlyNamesSync(onlyTheseWorkSpacesNamesRegex);

  const createWorkSpaceConfig = (basePath) => {
    const packageJsonPath = path.join(basePath, PKG_JSON_EXT);

    const isFileExist = checkPathExistsSync(packageJsonPath);

    if (!isFileExist) {
      return false;
    }

    const {
      name,
      routeData,
      dependencies,
      peerDependencies,
      devDependencies,
    } = readJsonFileSync(packageJsonPath, true);

    if (packageNamesFilterRegex && !packageNamesFilterRegex.test(name)) {
      return false;
    }

    return (onlyPages && routeData) || !onlyPages
      ? [
          name,
          {
            packagePath: packageJsonPath.replace(
              `/${PKG_JSON_EXT}`,
              withFileSrcPath ? "/src" : "",
            ),
            dependencies,
            peerDependencies,
            devDependencies,
            routeData,
          },
        ]
      : false;
  };

  const workspacesPackageJsonPathsData = workspaces.map((workspace) => {
    const mainWorkspacePath = path.join(projectRoot, workspace);
    if (APPS_REGEX.test(workspace)) {
      return [createWorkSpaceConfig(mainWorkspacePath)];
    }

    const isFileExist = checkPathExistsSync(mainWorkspacePath);

    if (!isFileExist) {
      invariant(false, createFoundEmptyWorkSpaceMsg(workspace));
      return false;
    }

    const packagesPaths = readdirSync(mainWorkspacePath);

    invariant(!!packagesPaths.length, createFoundEmptyWorkSpaceMsg(workspace));

    return packagesPaths.flat().map((packageFolderName) => {
      const packagePath = path.join(mainWorkspacePath, packageFolderName);
      return createWorkSpaceConfig(packagePath);
    });
  });

  const workspacesPackageJsonPaths = workspacesPackageJsonPathsData
    .flat()
    .filter(Boolean);

  return workspacesPackageJsonPaths.reduce((acc, [name, packageData]) => {
    if (name && packageData) {
      acc[name] = packageData;
    }
    return acc;
  }, {});
};

getWorkSpacesData();

module.exports = getWorkSpacesData;
