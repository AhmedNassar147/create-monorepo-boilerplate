/*
 *
 * `checkIfPackageAlreadyLinkedElseLink`: `@domain/install-bins`.
 *
 */
const { join } = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");
const logMessage = require("./logMessage");
const { checkPathExistsSync } = require("../../scripts");

const checkIfPackageAlreadyLinkedElseLink = ({
  binNames,
  packageName,
  packageFolderName,
  globalNpmBinsFolderPath,
  globalNpmModulesFolderPathSegments,
}) => {
  logMessage(chalk.white(`checking ${packageName}...`));

  const doesGlobalBinHasCurrentBins = binNames.every(
    (binName) => !!checkPathExistsSync(join(globalNpmBinsFolderPath, binName)),
  );

  const globalNpmModulesFolder = join(
    ...globalNpmModulesFolderPathSegments,
    packageName,
  );

  const doesGlobalNpmModulesHaveCurrentPackage = !!checkPathExistsSync(
    globalNpmModulesFolder,
  );

  if (doesGlobalNpmModulesHaveCurrentPackage && doesGlobalBinHasCurrentBins) {
    logMessage(chalk.green(`skipping ${packageName}, already linked 😉`));

    return;
  }

  const packageDirectory = join(__dirname, "../../", packageFolderName);
  try {
    execSync(`cd "${packageDirectory}" && npm link`);
    logMessage(chalk.green(`finished linking ${packageName} ✨`));
  } catch (error) {
    logMessage(
      chalk.red(
        `something went wrong when linking ${packageName} \n` +
          `nodeJS error: ${error}`,
      ),
      true,
    );
  }
};

module.exports = checkIfPackageAlreadyLinkedElseLink;
