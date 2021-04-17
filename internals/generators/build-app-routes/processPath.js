/*
 *
 * `processPath`: `build-app-routes`.
 *
 */
const getActualPathOrParam = require("./getActualPathOrParam");
const processParams = require("./processParams");

function processPath(path, params) {
  let actualPath = getActualPathOrParam(path, "/");
  const actualPathLength = actualPath.length;

  if (actualPathLength < 2) {
    actualPath = actualPath[0];

    if (params) {
      actualPath += processParams(params);
    }
  }

  return actualPath;
}

module.exports = processPath;
