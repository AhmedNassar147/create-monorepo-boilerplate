/*
 *
 * `getWorkSpacesData`: `workspaces`.
 *
 */
const { readdirSync } = require("fs");
const path = require("path");
const chalk = require("chalk");
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");
const toPackageNameWithScope = require("./toPackageNameWithScope");
const readJsonFileSync = require("../scripts/readJsonFileSync");
const checkPathExistsSync = require("../scripts/checkPathExistsSync");
const invariant = require("../scripts/invariant");
const { APPS_REGEX } = require("../constants");

const PKG_JSON_EXT = "package.json";

const createFoundEmptyWorkSpaceMsg = (workspace) => {
  return chalk.red(
    `Found an empty workspace ${chalk.bold.white(workspace)} ` +
      "please remove it or add a package to it.",
  );
};

const getWorkSpacesData = (options) => {
  const { onlyTheseWorkSpacesNamesRegex, onlyPages, packageNamesFilterRegex } =
    options || {};

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
      assetsPaths,
    } = readJsonFileSync(packageJsonPath, true);

    if (packageNamesFilterRegex && !packageNamesFilterRegex.test(name)) {
      return false;
    }

    return (onlyPages && routeData) || !onlyPages
      ? [
          name,
          {
            packagePath: packageJsonPath.replace(`/${PKG_JSON_EXT}`, ""),
            dependencies,
            peerDependencies,
            devDependencies,
            routeData,
            assetsPaths,
          },
        ]
      : false;
  };

  const workspacesPackageJsonPathsData = workspaces.map((workspace) => {
    const mainWorkspacePath = path.join(projectRoot, workspace);
    const isPathExist = checkPathExistsSync(mainWorkspacePath);

    if (!isPathExist) {
      invariant(false, createFoundEmptyWorkSpaceMsg(workspace));
      return false;
    }

    if (APPS_REGEX.test(workspace) && !onlyPages) {
      return [
        [
          toPackageNameWithScope(workspace),
          {
            packagePath: mainWorkspacePath,
          },
        ],
      ];
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

module.exports = getWorkSpacesData;
