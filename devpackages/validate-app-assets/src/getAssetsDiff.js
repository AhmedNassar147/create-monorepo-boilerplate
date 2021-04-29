/*
 *
 * `getAssetsDiff`: `@domain/validate-app-assets`.
 *
 */
const chalk = require("chalk");

const bold = chalk.bold;

const filter = (mapper, arrayIncludes, sign) => {
  const chalkColor = sign === "+" ? bold.green : bold.red;

  return mapper.map((assetPath) =>
    !arrayIncludes.includes(assetPath)
      ? chalkColor(`${sign} ${assetPath}\n`)
      : false,
  );
};

const getAssetsDiff = (newAssetsArray, oldAssetsArray) => {
  const toBeRemoved = filter(oldAssetsArray, newAssetsArray, "-");
  const toBeAdded = filter(newAssetsArray, oldAssetsArray, "+");

  return [...toBeRemoved, ...toBeAdded].filter(Boolean);
};

module.exports = getAssetsDiff;
