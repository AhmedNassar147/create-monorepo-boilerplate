/*
 *
 * `getBaseEnvVariableValues`: `environment`.
 *
 */
const { CLIENTS_DATA, CLIENT_NAMES } = require("./constants");
const invariant = require("../scripts/invariant");

const formalizeValue = (value) => {
  const strValue = value.toString();
  return value < 10 ? `0${strValue}` : strValue;
};

const getBaseEnvVariableValues = (clientName) => {
  clientName = clientName || "NAME";
  invariant(
    CLIENT_NAMES.includes(clientName),
    `wrong client name given clientName=${clientName}
    client name must be one of these "${CLIENT_NAMES.join(",")}" clients.`,
  );

  const date = new Date();
  const year = date.getFullYear().toString().substr(-1);

  const month = formalizeValue(date.getMonth() + 1);
  const day = formalizeValue(date.getDate());
  const mins = formalizeValue(date.getMinutes());
  const hours = formalizeValue(date.getHours());
  const time = `${hours}${mins}`;

  return {
    BUILD_YEAR: year,
    BUILD_MONTH: month,
    BUILD_DAY: day,
    BUILD_TIME: time,
    SERVER_PORT: "9090",
    API_BASE_URL: CLIENTS_DATA[clientName],
    CLIENT_NAME: clientName,
  };
};

module.exports = getBaseEnvVariableValues;
