/*
 *
 * Package: `@domain/install-bins`.
 *
 */
const { join } = require("path");
const { spawnSync } = require("child_process");
const chalk = require("chalk");
const logMessage = require("./logMessage");
const getHuskyBinsInstalled = require("./getHuskyBinsInstalled");
const collectBinsPackages = require("./collectBinsPackages");
const checkIfPackageAlreadyLinkedElseLink = require("./checkIfPackageAlreadyLinkedElseLink");
const {
  findRootYarnWorkSpaces,
  checkPathExistsSync,
} = require("../../scripts");

(() => {
  const nodeModulesPath = join(findRootYarnWorkSpaces(), "node_modules");

  if (!checkPathExistsSync(nodeModulesPath)) {
    logMessage(
      `the \`node_modules\` folder not found, please run \`yarn bootstrap\``,
      true,
    );
  }

  const nodeModulesBinsPath = join(nodeModulesPath, ".bin");

  if (!checkPathExistsSync(nodeModulesBinsPath)) {
    logMessage(
      `can't install the \`bins\` yet, the \`bins\` folder in \`node_modules\` folder not found.`,
      true,
    );
  }

  getHuskyBinsInstalled({
    nodeModulesBinsPath,
    nodeModulesPath,
  });

  const { stdout, stderr, status } = spawnSync("npm", [
    "config",
    "get",
    "prefix",
  ]);

  if (status) {
    logMessage(
      `couldn't get the global \`npm\` path (1). \n` +
        `nodeJS error: ${stderr.toString()}`,
      true,
    );
  }

  const [npmGlobalFilePath] = stdout.toString().split("\n").filter(Boolean);

  if (!npmGlobalFilePath) {
    logMessage(`couldn't get the global \`npm\` path (2).`, true);
  }

  const localPinsPackages = collectBinsPackages();

  if (!localPinsPackages) {
    logMessage(
      chalk.white(`found 0 packages with bins in devpackages.`),
      true,
      0,
    );
  }

  localPinsPackages.forEach((packageData) => {
    checkIfPackageAlreadyLinkedElseLink({
      ...packageData,
      npmGlobalFilePath,
    });
  });
})();
