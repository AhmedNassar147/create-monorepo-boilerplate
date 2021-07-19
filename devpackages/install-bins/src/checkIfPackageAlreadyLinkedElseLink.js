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
  npmGlobalFilePath,
  binNames,
  packageName,
  packageFolderName,
}) => {
  logMessage(chalk.white(`checking ${packageName}...`));

  const globalNpmBinFolderPath = join(npmGlobalFilePath, "bin");

  const doesGlobalBinHasCurrentBins = binNames.every(
    (binName) => !!checkPathExistsSync(join(globalNpmBinFolderPath, binName)),
  );

  const globalNpmModulesFolder = join(
    npmGlobalFilePath,
    "lib",
    "node_modules",
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
    );
  }
};

module.exports = checkIfPackageAlreadyLinkedElseLink;
