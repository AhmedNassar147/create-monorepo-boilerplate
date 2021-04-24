/*
 *
 * `getPackagesData`: `@domain/validate-packages-deps`.
 *
 */
const chalk = require("chalk");
const { scriptName } = require("./constants");
const getAllFilesFromFolder = require("./getAllFilesFromFolder");
const {
  PROJECT_NAME_SPACE,
  PACKAGES_MODULES_REGEX,
  PACKAGE_FULL_NAME_REGEXP,
} = require("../../../internals/constants");
const getWorkSpacesData = require("../../../internals/workspaces/getWorkSpacesData");

const getPackagesData = (filter) => {
  let packageNamesFilterRegex;

  if (filter) {
    const packageName = PACKAGE_FULL_NAME_REGEXP.test(filter)
      ? filter
      : `${PROJECT_NAME_SPACE}/${filter}`;

    packageNamesFilterRegex = new RegExp(packageName);
  }

  const allModulesAndPackages = getWorkSpacesData({
    onlyTheseWorkSpacesNamesRegex: PACKAGES_MODULES_REGEX,
    packageNamesFilterRegex,
  });

  const packagesKeys = Object.keys(allModulesAndPackages);

  if (!packagesKeys.length) {
    return [false];
  }

  return packagesKeys.map(async (packageName) => {
    const {
      dependencies,
      peerDependencies,
      packagePath,
    } = allModulesAndPackages[packageName];

    let filesInSrcDir = await getAllFilesFromFolder(`${packagePath}/src`);
    filesInSrcDir =
      filesInSrcDir && !!filesInSrcDir.length ? filesInSrcDir : false;

    if (!filesInSrcDir) {
      console.log(
        chalk.bold.keyword("orange")(
          `[${scriptName}][getPackagesData]: found no files to process in  ${packageName}` +
            "please check if the package has no files to process remove it.",
        ),
      );
    }

    return !filesInSrcDir
      ? false
      : {
          packageName,
          packageBaseDirPath: packagePath,
          filesInSrcDir,
          dependencies,
          peerDependencies,
        };
  });
};

module.exports = getPackagesData;
