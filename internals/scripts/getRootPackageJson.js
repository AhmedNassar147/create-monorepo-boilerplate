/*
 *
 * `getRootPackageJson`: `scripts`.
 *
 */
const { join } = require("path");
const readJsonFile = require("./readJsonFile");
const invariant = require("./invariant");
const findRootYarnWorkSpaces = require("../workspaces/findRootYarnWorkSpaces");

const getRootPackageJson = async () => {
  const projectRoot = findRootYarnWorkSpaces();

  invariant(
    projectRoot,
    `\`(getRootPackageJson)\` couldn't find root workspaces path.`,
  );

  return await readJsonFile(join(projectRoot, "package.json"), true);
};

module.exports = getRootPackageJson;
