/*
 *
 * `collectEnvVariablesFromEnvFiles`: `environment`.
 *
 */
const { readFileSync } = require("fs");
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

const collectEnvVariablesFromEnvFiles = (mode) => {
  const isEnvProduction = mode === "production";

  const envVariables = {
    "process.env.NODE_ENV": mode,
  };

  let canReadEnvFile = false;
  let envFilePath = "";

  if (isEnvProduction) {
    const fullFullPath = checkIsFileExistAndGetFilePath(
      ENVIRONMENT_FILE_NAMES.PROD,
    );

    if (fullFullPath) {
      canReadEnvFile = true;
      envFilePath = fullFullPath;
    }
  }

  // if '.env.production' not found we always get them from '.env' if exists.
  if (!canReadEnvFile) {
    const fullFullPath = checkIsFileExistAndGetFilePath(
      ENVIRONMENT_FILE_NAMES.NORMAL,
    );

    if (fullFullPath) {
      canReadEnvFile = true;
      envFilePath = fullFullPath;
    }
  }

  if (canReadEnvFile && envFilePath) {
    let variablesString = readFileSync(envFilePath, { encoding: "utf8" });
    variablesString = variablesString || "";

    if (variablesString) {
      const matchedVariables = variablesString.match(/.+/gim);

      if (Array.isArray(matchedVariables) && !!matchedVariables.length) {
        matchedVariables.map((variableString) => {
          const [name, value] = variableString.replace(/\s/g, "").split("=");
          envVariables[name] = value;
        });
      }
    }
  }

  return envVariables;
};

module.exports = collectEnvVariablesFromEnvFiles;
