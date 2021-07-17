/*
 *
 * `findRootYarnWorkSpaces`: `@domain/scripts`.
 *
 */
const { normalize, join } = require("path");
const readJsonFileSync = require("./readJsonFileSync");
const checkPathExistsSync = require("./checkPathExistsSync");

const extractWorkspaces = (manifest) => {
  const workspaces = (manifest || {}).workspaces;
  return Array.isArray(workspaces) ? workspaces : false;
};

const readPackageJSON = (dir) => {
  const file = join(dir, "package.json");

  if (checkPathExistsSync(file)) {
    return readJsonFileSync(file, true);
  }

  return null;
};

const findRootYarnWorkSpaces = (initial, maxReties) => {
  if (!initial) {
    initial = process.cwd();
  }

  initial = normalize(initial);

  const maximumRetries = maxReties || 100;

  let result = "";
  let tries = 0;

  do {
    const manifest = readPackageJSON(initial);
    const workspaces = extractWorkspaces(manifest);

    if (workspaces) {
      result = initial;
      break;
    } else {
      initial = join(initial, "..");
      ++tries;
    }
  } while (tries < maximumRetries);

  return result;
};

module.exports = findRootYarnWorkSpaces;
