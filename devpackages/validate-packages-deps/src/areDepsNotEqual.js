/*
 *
 * `areDepsNotEqual`: `@domain/validate-packages-deps`.
 *
 */
const toProperJson = (depsObj) => JSON.stringify(depsObj || {});

const areDepsNotEqual = (deps1, deps2) => {
  const [deps1String, deps2String] = [toProperJson(deps1), toProperJson(deps2)];

  return deps1String !== deps2String;
};

module.exports = areDepsNotEqual;
