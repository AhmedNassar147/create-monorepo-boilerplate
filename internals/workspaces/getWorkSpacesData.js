/*
 *
 * `getWorkSpacesData`: `scripts`.
 *
 */
const { readdirSync } = require("fs");
const path = require("path");
const getWorksSpacesOnlyNamesSync = require("./getWorksSpacesOnlyNamesSync");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");
const readJsonFileSync = require("../scripts/readJsonFileSync");
const checkPathExistsSync = require("../scripts/checkPathExistsSync");
const invariant = require("../scripts/invariant");
const { APPS_REGEX } = require("../constants/base");

const PKG_JSON_EXT = "package.json";

const getWorkSpacesData = (options) => {
  const { withFileSrcPath, onlyTheseWorkSpacesNamesRegex, onlyPages } =
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
    } = readJsonFileSync(packageJsonPath, true);

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

    const packagesPaths = readdirSync(mainWorkspacePath);

    return packagesPaths.flat().map((packageFolderName) => {
      const packagePath = path.join(mainWorkspacePath, packageFolderName);
      return createWorkSpaceConfig(packagePath);
    });
  });

  const workspacesPackageJsonPaths = workspacesPackageJsonPathsData
    .flat()
    .filter(Boolean);

  return workspacesPackageJsonPaths.reduce((acc, [name, packageData]) => {
    acc[name] = packageData;
    return acc;
  }, {});
};

module.exports = getWorkSpacesData;
