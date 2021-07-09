/*
 *
 * `getBaseEnvVariableValues`: `environment`.
 *
 */
const { CLIENTS_DATA, CLIENT_NAMES } = require("./constants");
const createBuildDateAndTimes = require("./createBuildDateAndTimes");
const invariant = require("../scripts/invariant");

const getBaseEnvVariableValues = (clientName) => {
  clientName = clientName || "NAME";
  invariant(
    CLIENT_NAMES.includes(clientName),
    `wrong client name given clientName=${clientName}
    client name must be one of these "${CLIENT_NAMES.join(",")}" clients.`,
  );

  const { year, month, day, time } = createBuildDateAndTimes();

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
