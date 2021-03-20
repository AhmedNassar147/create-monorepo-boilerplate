/*
 *
 * `getWorkSpacesData`: `scripts`.
 *
 */
const { readdirSync } = require("fs");
const path = require("path");
const readJsonFileSync = require("./readJsonFileSync");
const getRootPackageJson = require("./getRootPackageJson");
const getProperWorkSpaceName = require("./getProperWorkSpaceName");
const getProjectRootDirectoryPath = require("./getProjectRootDirectoryPath");
const { PKG_JSON_EXT, PACKAGES_KEYWORD } = require("../constants/base");

const getWorkSpacesData = (withFileSrcPath) => {
  const { workspaces } = getRootPackageJson();

  const workspacesPackageJsonPaths = workspaces
    .map((workspace) => {
      workspace = getProperWorkSpaceName(workspace);
      const mainWorkspacePath = path.join(
        getProjectRootDirectoryPath(),
        workspace,
      );

      if (workspace.includes(PACKAGES_KEYWORD)) {
        const packagesPaths = readdirSync(mainWorkspacePath);

        return packagesPaths.map((packageFolderName) =>
          path.join(mainWorkspacePath, packageFolderName, PKG_JSON_EXT),
        );
      }

      return path.join(mainWorkspacePath, PKG_JSON_EXT);
    })
    .flat();

  // {
  //   '@domain/pkg1': '/basePath/create-react-monorepo-boilerplate/packages/pkg1',
  //   '@domain/pkg2': '/basePath/create-react-monorepo-boilerplate/packages/pkg2',
  //   '@domain/pkg3': '/basePath/create-react-monorepo-boilerplate/packages/pkg3',
  //   '@domain/app': '/basePath/create-react-monorepo-boilerplate/app'
  // }
  return workspacesPackageJsonPaths.reduce((acc, packageJsonPath) => {
    const { name } = readJsonFileSync(packageJsonPath, true);
    acc[name] = packageJsonPath.replace(
      `/${PKG_JSON_EXT}`,
      withFileSrcPath ? "/src" : "",
    );
    return acc;
  }, {});
};

module.exports = getWorkSpacesData;
