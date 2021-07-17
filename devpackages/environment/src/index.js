/*
 *
 * Package: `environment`.
 *
 */
const checkIsFileExistAndGetFilePath = require("./checkIsFileExistAndGetFilePath");
const createBuildDateAndTimes = require("./createBuildDateAndTimes");
const geEnvVariables = require("./geEnvVariables");
const getBaseEnvVariableValues = require("./getBaseEnvVariableValues");
const collectEnvVariablesFromEnvFiles = require("./collectEnvVariablesFromEnvFiles");
const {
  CLIENTS_DATA,
  CLIENT_NAMES,
  ENVIRONMENT_FILE_NAMES,
} = require("./constants");

module.exports = {
  checkIsFileExistAndGetFilePath,
  createBuildDateAndTimes,
  geEnvVariables,
  getBaseEnvVariableValues,
  collectEnvVariablesFromEnvFiles,
  CLIENTS_DATA,
  CLIENT_NAMES,
  ENVIRONMENT_FILE_NAMES,
};
