/*
 *
 * `getHuskyBinsInstalled`: `@domain/install-bins`.
 *
 */
const { join } = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");
const logMessage = require("./logMessage");
const {
  findRootYarnWorkSpaces,
  checkPathExistsSync,
} = require("../../scripts");

const getHuskyBinsInstalled = ({ nodeModulesPath, nodeModulesBinsPath }) => {
  logMessage(chalk.white(`checking \`husky\` bins...`));

  const nodeModulesHuskyPath = join(nodeModulesPath, "husky");

  if (!checkPathExistsSync(nodeModulesHuskyPath)) {
    logMessage(
      `can't install the \`husky bins\`, please install husky ` +
        "please run `yarn add husky -D -W",
      true,
    );
  }

  const nodeModulesHuskyBinsPath = join(nodeModulesBinsPath, "husky");
  const rootHuskyFolderPath = join(findRootYarnWorkSpaces(), ".husky");

  if (
    !checkPathExistsSync(nodeModulesHuskyBinsPath) ||
    !checkPathExistsSync(rootHuskyFolderPath)
  ) {
    logMessage(chalk.green(`installing the \`husky bins\`...`));

    try {
      execSync("husky install");
    } catch (error) {
      logMessage(
        `something wrong happened when installing the \`husky bins\` \n` +
          `nodeJS error: ${error}`,
        true,
      );
    }
  } else {
    logMessage(
      chalk.green(
        `skipped the \`husky bins\` installation, already installed 😉`,
      ),
    );
  }
};

module.exports = getHuskyBinsInstalled;
