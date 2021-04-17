/*
 *
 * `getActualPathOrParam`: `build-app-routes`.
 *
 */
function getActualPathOrParam(pathOrParam, separator) {
  let actual = Array.isArray(pathOrParam) ? pathOrParam : [pathOrParam];

  actual = actual.map((pathOrParamKey) =>
    pathOrParamKey.startsWith(separator)
      ? pathOrParamKey
      : `${separator}${pathOrParamKey}`,
  );

  return actual;
}

module.exports = getActualPathOrParam;
