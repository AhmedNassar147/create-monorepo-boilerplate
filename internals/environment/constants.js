/*
 *
 * constants: `environment`.
 *
 */
const CLIENTS_DATA = {
  NAME: {
    URL: "some-url",
  },
};

const CLIENT_NAMES = Object.keys(CLIENTS_DATA);

const ENVIRONMENT_FILE_NAMES = {
  NORMAL: ".env",
  PROD: ".env.production",
};

const PROJECT_PREFIX_ENV_NAME = "ME_PREFIXED_VARIABLE_NAMED_";

module.exports = {
  CLIENTS_DATA,
  CLIENT_NAMES,
  ENVIRONMENT_FILE_NAMES,
  PROJECT_PREFIX_ENV_NAME,
};
