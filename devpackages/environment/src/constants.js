/*
 *
 * constants: `environment`.
 *
 */
const CLIENTS_DATA = {
  NAME: "some-url",
};

const CLIENT_NAMES = Object.keys(CLIENTS_DATA);

const ENVIRONMENT_FILE_NAMES = {
  NORMAL: ".env",
  PROD: ".env.production",
};

module.exports = {
  CLIENTS_DATA,
  CLIENT_NAMES,
  ENVIRONMENT_FILE_NAMES,
};
