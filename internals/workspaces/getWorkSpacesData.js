/*
 *
 * `getWorkSpacesData`: `scripts`.
 *
 */
const { readdir } = require("fs/promises");
const path = require("path");
const getWorksSpacesOnlyNames = require("./getWorksSpacesOnlyNames");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");
const readJsonFile = require("../scripts/readJsonFile");
const invariant = require("../scripts/invariant");
const { PACKAGES_REGEX } = require("../constants/base");

const PKG_JSON_EXT = "package.json";

const getWorkSpacesData = async (options) => {
  const { withFileSrcPath, onlyTheseWorkSpacesNames } = options || {};

  const projectRoot = findRootYarnWorkSpaces();

  invariant(projectRoot, `couldn't find root workspaces path.`);

  let workspaces = await getWorksSpacesOnlyNames();

  workspaces = onlyTheseWorkSpacesNames
    ? workspaces.filter((workspaceName) =>
        onlyTheseWorkSpacesNames.includes(workspaceName),
      )
    : workspaces;

  const createWorkSpaceConfig = async (basePath) => {
    const packageJsonPath = path.join(basePath, PKG_JSON_EXT);
    const { name } = await readJsonFile(packageJsonPath, true);

    return Promise.resolve([
      name,
      packageJsonPath.replace(
        `/${PKG_JSON_EXT}`,
        withFileSrcPath ? "/src" : "",
      ),
    ]);
  };

  const workspacesPackageJsonPathsPromises = workspaces.map(
    async (workspace) => {
      const mainWorkspacePath = path.join(projectRoot, workspace);

      if (PACKAGES_REGEX.test(workspace)) {
        const packagesPaths = await readdir(mainWorkspacePath);

        return await Promise.all(
          packagesPaths.map(async (packageFolderName) => {
            const packagePath = path.join(mainWorkspacePath, packageFolderName);
            return await createWorkSpaceConfig(packagePath);
          }),
        );
      }

      return [await createWorkSpaceConfig(mainWorkspacePath)];
    },
  );

  const workspacesPackageJsonPaths = (
    await Promise.all(workspacesPackageJsonPathsPromises)
  )
    .filter(Boolean)
    .flat();

  // {
  //   '@domain/pkg1': '/basePath/create-react-monorepo-boilerplate/packages/pkg1',
  //   '@domain/app': '/basePath/create-react-monorepo-boilerplate/app'
  // }
  return Promise.resolve(
    workspacesPackageJsonPaths.reduce((acc, [name, workspacePath]) => {
      acc[name] = workspacePath;
      return acc;
    }, {}),
  );
};

module.exports = getWorkSpacesData;
