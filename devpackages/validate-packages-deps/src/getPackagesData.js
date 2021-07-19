/*
 *
 * `getPackagesData`: `@domain/validate-packages-deps`.
 *
 */
const chalk = require("chalk");
const { scriptName, ignoredPathsRegex } = require("./constants");
const {
  PACKAGES_MODULES_REGEX,
  getWorkSpacesData,
  toPackageNameWithScope,
  getAllFilesFromFolder,
} = require("../../scripts");

const getPackagesData = (filter) => {
  let packageNamesFilterRegex;

  if (filter) {
    const packageName = toPackageNameWithScope(filter);

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
    const { dependencies, peerDependencies, packagePath } =
      allModulesAndPackages[packageName];

    let filesInSrcDir = await getAllFilesFromFolder(
      `${packagePath}/src`,
      ignoredPathsRegex,
    );
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
