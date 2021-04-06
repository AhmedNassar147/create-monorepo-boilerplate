/*
 *
 * `collectProcessOptions`: `command-line-utils`.
 *
 */
const collectProcessOptionsSync = require("./collectProcessOptionsSync");

const collectProcessOptions = async () => {
  return await new Promise((resolve) => resolve(collectProcessOptionsSync()));
};

module.exports = collectProcessOptions;
