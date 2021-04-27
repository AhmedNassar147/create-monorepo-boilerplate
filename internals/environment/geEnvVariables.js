/*
 *
 * `getEnvVariables`: `environment`.
 *
 */
const getBaseEnvVariableValues = require("./getBaseEnvVariableValues");
const collectEnvVariablesFromEnvFiles = require("./collectEnvVariablesFromEnvFiles");

const getEnvVariables = ({ mode }) => {
  mode = mode || process.env.NODE_ENV;

  let envVariables = collectEnvVariablesFromEnvFiles(mode);

  const baseEnvVariables = getBaseEnvVariableValues(envVariables.CLIENT_NAME);

  envVariables = {
    ...envVariables,
    ...baseEnvVariables,
  };

  const envKeys = Object.keys(envVariables);

  const stringifiedVariables = envKeys.reduce((env, key) => {
    env[key] = JSON.stringify(envVariables[key]);
    return env;
  }, {});

  return {
    raw: envVariables,
    stringifiedVariables,
  };
};

module.exports = getEnvVariables;
