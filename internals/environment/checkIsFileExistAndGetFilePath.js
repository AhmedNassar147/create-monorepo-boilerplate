/*
 *
 * `checkIsFileExistAndGetFilePath`: `environment`.
 *
 */
const { join } = require("path");
const chalk = require("chalk");
const { ENVIRONMENT_FILE_NAMES } = require("./constants");
const findRootYarnWorkSpaces = require("../workspaces/findRootYarnWorkSpaces");
const checkPathExistsSync = require("../scripts/checkPathExistsSync");

const checkIsFileExistAndGetFilePath = (envFileName) => {
  const rootPath = findRootYarnWorkSpaces();

  const fullFullPath = join(rootPath, envFileName);
  const doesFileExist = checkPathExistsSync(fullFullPath);

  if (!doesFileExist && envFileName === ENVIRONMENT_FILE_NAMES.NORMAL) {
    console.log(
      chalk.bold.red(
        `\`(getEnvVariables)\`: couldn't find ${chalk.white(
          envFileName,
        )} file in ${chalk.white(rootPath)}`,
      ),
    );

    process.exit(1);
  }

  return doesFileExist;
};

module.exports = checkIsFileExistAndGetFilePath;
