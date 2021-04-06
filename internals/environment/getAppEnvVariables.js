/*
 *
 * `getAppEnvVariables`: `environment`.
 *
 */
const { existsSync, readFileSync } = require("fs");
const { join } = require("path");
const {
  ENVIRONMENT_FILE_NAMES,
  PROJECT_PREFIX_ENV_NAME,
  CLIENT_NAMES,
} = require("../environment/constants");
const getBaseEnvVariableValues = require("../environment/getBaseEnvVariableValues");

const checkIsFileExistAndGetFilePath = (basePath, envFileName) => {
  const fullFullPath = join(basePath, envFileName);

  return {
    fullFullPath,
    isExist: existsSync(fullFullPath),
  };
};

const getAppEnvVariables = (appBasePath, mode) => {
  const clientName = process.env.CLIENT || CLIENT_NAMES[0];
  const serverPort = process.env.SERVER_PORT;

  const isEnvProduction = mode === "production";

  const envVariables = getBaseEnvVariableValues(clientName, serverPort);

  const PREFIX_REGEX = new RegExp(`^${PROJECT_PREFIX_ENV_NAME}`, "i");

  Object.keys(process.env)
    .filter((key) => PREFIX_REGEX.test(key))
    .forEach((key) => {
      envVariables[key.replace(PREFIX_REGEX, "")] = process.env[key];
    });

  let canReadEnvFile = false;
  let envFilePath = "";

  if (isEnvProduction) {
    const { fullFullPath, isExist } = checkIsFileExistAndGetFilePath(
      appBasePath,
      ENVIRONMENT_FILE_NAMES.PROD,
    );

    if (isExist) {
      canReadEnvFile = isExist;
      envFilePath = fullFullPath;
    }
  }

  // if '.env.production' not found we always get them from '.env' if exists.
  if (!canReadEnvFile) {
    const { fullFullPath, isExist } = checkIsFileExistAndGetFilePath(
      appBasePath,
      ENVIRONMENT_FILE_NAMES.NORMAL,
    );

    if (isExist) {
      canReadEnvFile = isExist;
      envFilePath = fullFullPath;
    }
  }

  if (canReadEnvFile && envFilePath) {
    let variablesString = readFileSync(envFilePath, "utf-8");
    variablesString = variablesString || "";

    if (!!variablesString) {
      const matchedVariables = variablesString.match(/.+/gim);

      if (Boolean(matchedVariables)) {
        matchedVariables.map((variableString) => {
          const [name, value] = variableString.replace(/\s/g, "").split("=");
          envVariables[name] = value;
        });
      }
    }
  }

  const envKeys = Object.keys(envVariables);

  const stringifiedVariables = {
    "process.env.NODE_ENV": JSON.stringify(mode),
    ...envKeys.reduce((env, key) => {
      env[key] = JSON.stringify(envVariables[key]);
      return env;
    }, {}),
  };

  console.log("stringifiedVariables", stringifiedVariables);

  return {
    raw: envVariables,
    stringifiedVariables,
  };
};

module.exports = getAppEnvVariables;
