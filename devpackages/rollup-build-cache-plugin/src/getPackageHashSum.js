/*
 *
 * `getPackageHashSum`: `@domain/rollup-build-cache-plugin`.
 *
 */
const { getFolderFilesHashSum, getUsedNodeVersion } = require("../../scripts");

const getPackageHashSum = async ({ packageSrcPath, currentEnv }) => {
  const filesHashesString = (await getFolderFilesHashSum(packageSrcPath)).join(
    "",
  );

  const currentNodeVersion = getUsedNodeVersion();

  return `${filesHashesString}-${currentEnv}-node${currentNodeVersion}`;
};

module.exports = getPackageHashSum;
