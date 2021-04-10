/*
 *
 * `findRootYarnWorkSpaces`: `workspaces`.
 *
 */
const { existsSync } = require("fs");
const { normalize, join } = require("path");
const readJsonFileSync = require("../scripts/readJsonFileSync");

const extractWorkspaces = (manifest) => {
  const workspaces = (manifest || {}).workspaces;
  return Array.isArray(workspaces) ? workspaces : false;
};

const readPackageJSON = (dir) => {
  const file = join(dir, "package.json");

  if (existsSync(file)) {
    return readJsonFileSync(file, true);
  }

  return null;
};

const findRootYarnWorkSpaces = (initial, maxReties) => {
  if (!initial) {
    initial = process.cwd();
  }

  initial = normalize(initial);
  let result = "";
  let tries = 0;

  do {
    ++tries;
    const manifest = readPackageJSON(initial);
    const workspaces = extractWorkspaces(manifest);

    if (workspaces) {
      result = initial;
      break;
    } else {
      initial = join(initial, "..");
      ++tries;
    }
  } while (tries < (maxReties || 20));

  return result;
};

module.exports = findRootYarnWorkSpaces;
