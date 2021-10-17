/*
 *
 * Package: `@domain/install-bins`.
 *
 */
const { join } = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const chalk = require("chalk");
const logMessage = require("./logMessage");
const getHuskyBinsInstalled = require("./getHuskyBinsInstalled");
const collectBinsPackages = require("./collectBinsPackages");
const checkIfPackageAlreadyLinkedElseLink = require("./checkIfPackageAlreadyLinkedElseLink");
const {
  findRootYarnWorkSpaces,
  checkPathExistsSync,
  isWindowsPlatform,
} = require("../../scripts");

const asyncExec = promisify(exec);

(async () => {
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

  const { stdout, stderr } = await asyncExec("npm config get prefix");
  const npmGlobalFilePath = (stdout || "").toString();

  if (stderr || !npmGlobalFilePath) {
    logMessage(`couldn't get the global \`npm\` path.`, true);
  }

  const localPinsPackages = collectBinsPackages();

  if (!localPinsPackages) {
    logMessage(
      chalk.white(`found 0 packages with bins in devpackages.`),
      true,
      0,
    );
  }

  const isWindowsOs = isWindowsPlatform();

  const globalNpmBinsFolderPath = isWindowsOs
    ? npmGlobalFilePath
    : join(npmGlobalFilePath, "bin");

  const globalNpmModulesFolderPathSegments = [
    npmGlobalFilePath,
    isWindowsOs ? "" : "lib",
    "node_modules",
  ].filter(Boolean);

  localPinsPackages.forEach((packageData) => {
    checkIfPackageAlreadyLinkedElseLink({
      ...packageData,
      globalNpmBinsFolderPath,
      globalNpmModulesFolderPathSegments,
    });
  });

  if (isWindowsOs) {
    logMessage(
      chalk.yellow(
        "checking scripts execution policy on windows to run our spcipts on windows powershell",
      ),
    );

    const { stdout: curretnUserExecutionPolicy } = await asyncExec(
      "Get-ExecutionPolicy",
      {
        shell: "powershell.exe",
      },
    );

    const curretnUserExecutionPolicyWithoutSpaces =
      curretnUserExecutionPolicy.replace(/\s|\r/g, "");

    const isExecutionPolicyAlreadyUnRestricted =
      curretnUserExecutionPolicyWithoutSpaces === "Unrestricted";

    logMessage(
      chalk.yellow(
        `current scripts policy execution is "${chalk.white.bold(
          curretnUserExecutionPolicyWithoutSpaces,
        )}" ${
          isExecutionPolicyAlreadyUnRestricted ? "no extra worked needed" : ""
        }`,
      ),
    );

    if (!isExecutionPolicyAlreadyUnRestricted) {
      logMessage('changing scripts policy execution to "Unrestricted"');

      const { stderr: forcingPowershellRestrictionError } = await asyncExec(
        'Set-ExecutionPolicy -Scope "CurrentUser" -ExecutionPolicy "Unrestricted"',
        {
          shell: "powershell.exe",
        },
      );

      if (forcingPowershellRestrictionError) {
        logMessage(
          "error when allowing scripts to run on windows powershell",
          forcingPowershellRestrictionError,
          true,
        );
      }
    }
  }
})();
