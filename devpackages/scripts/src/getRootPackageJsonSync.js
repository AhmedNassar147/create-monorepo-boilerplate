/*
 *
 * `getRootPackageJsonSync`: `@domain/scripts`.
 *
 */
const { join } = require("path");
const readJsonFileSync = require("./readJsonFileSync");
const invariant = require("./invariant");
const findRootYarnWorkSpaces = require("./findRootYarnWorkSpaces");

const getRootPackageJsonSync = () => {
  const projectRoot = findRootYarnWorkSpaces();

  invariant(
    projectRoot,
    `\`(getRootPackageJsonSync)\` couldn't find root workspaces path.`,
  );

  return readJsonFileSync(join(projectRoot, "package.json"), true);
};

module.exports = getRootPackageJsonSync;
