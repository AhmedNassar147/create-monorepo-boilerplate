/*
 *
 * `processPackage`: `@domain/validate-packages-deps`.
 *
 */
const chalk = require("chalk");
const collectFileDeps = require("./collectFileDeps");
const areDepsNotEqual = require("./areDepsNotEqual");
const sortDeps = require("./sortDeps");
const { scriptName } = require("./constants");
const { PACKAGE_FULL_NAME_REGEXP } = require("../../../internals/constants");
const getRootPackageJsonSync = require("../../../internals/scripts/getRootPackageJsonSync");

const TYPES_PACKAGE_START = "@types/";

const isOriginalKeysEqualNew = (original, newDeps) => {
  const [l1, l2] = [original, newDeps].map(
    (obj) => Object.keys(obj || {}).length,
  );
  return l1 === l2;
};

const processPackage = async ({
  packageName,
  filesInSrcDir,
  dependencies: originalDependencies,
  peerDependencies: originalPeerDependencies,
  logOnlyResults,
}) => {
  console.log(
    chalk.bold.white(
      `[${scriptName}]: processing files in ${packageName} package.`,
    ),
  );

  let packageDeps = (
    await Promise.all(
      filesInSrcDir.map((filePath) =>
        collectFileDeps(filePath, logOnlyResults),
      ),
    )
  )
    .flat()
    .filter(Boolean);

  if (!packageDeps.length) {
    console.log(
      chalk.bold.keyword("orange")(
        `[${scriptName}]: skipping "${packageName}" package there is no ` +
          "import statment to be includes in the package dependencies.",
      ),
    );
    process.exit(0);
  }

  const {
    dependencies: rootDependencies,
    devDependencies: rootDevDependencies,
    preserveModulesImportPathName,
  } = getRootPackageJsonSync();

  const preservedModulesPathName = preserveModulesImportPathName || [];

  packageDeps = packageDeps.map((packageName) => {
    if (
      preservedModulesPathName.includes(packageName) ||
      packageName.startsWith(TYPES_PACKAGE_START) ||
      PACKAGE_FULL_NAME_REGEXP.test(packageName) ||
      !packageName.includes("/")
    ) {
      return packageName;
    }
    return packageName.replace(/'|"|\/.+$/gi, "");
  });

  let normalizedPackageDepsArray = [...new Set(packageDeps)];

  let packageFoundDependencies = {};
  let packageFoundPeerDependencies = {};

  normalizedPackageDepsArray.forEach((name) => {
    const isDependencies = PACKAGE_FULL_NAME_REGEXP.test(name);

    const depsObj = isDependencies
      ? packageFoundDependencies
      : packageFoundPeerDependencies;

    depsObj[name] = isDependencies ? "1.0.0" : "x.x.x";
  });

  const packagesPeerDependenciesKeys = Object.keys(
    packageFoundPeerDependencies,
  );

  let curedPeerDependencies = {};

  if (packagesPeerDependenciesKeys.length) {
    const allRootDeps = {
      ...rootDependencies,
      ...rootDevDependencies,
    };

    packagesPeerDependenciesKeys.forEach((libName) => {
      const isTypesPackage = libName.startsWith(TYPES_PACKAGE_START);
      const actualPackageName = isTypesPackage
        ? libName.replace(TYPES_PACKAGE_START, "")
        : libName;

      const hasCurrentPackage = !!allRootDeps[actualPackageName];

      if (!hasCurrentPackage) {
        console.log(
          chalk.red(`
          Couldn't Find library "[[${chalk.bold.white(
            libName || actualPackageName,
          )}]]" in root "[[[package.json]]] when processing ${packageName}".
          Please Install It via Only "YARN" and try again.
        `),
        );

        process.exit(1);
      }

      const libBaseVersion = allRootDeps[actualPackageName].split(".")[0];
      curedPeerDependencies[actualPackageName] = `${libBaseVersion}.x.x`;
    });
  }

  packageFoundDependencies = sortDeps(packageFoundDependencies);
  curedPeerDependencies = sortDeps(curedPeerDependencies);

  const areDependenciesChanged =
    areDepsNotEqual(originalDependencies, packageFoundDependencies) &&
    !isOriginalKeysEqualNew(originalDependencies, packageFoundDependencies);

  const arePeerDependenciesChanged =
    areDepsNotEqual(originalPeerDependencies, curedPeerDependencies) &&
    !isOriginalKeysEqualNew(originalPeerDependencies, curedPeerDependencies);

  if (areDependenciesChanged || arePeerDependenciesChanged) {
    return new Promise((resolve) => {
      resolve({
        packageName,
        arePeerDependenciesChanged,
        curedPeerDependencies,
        areDependenciesChanged,
        packageFoundDependencies,
      });
    });
  }

  return false;
};

module.exports = processPackage;
