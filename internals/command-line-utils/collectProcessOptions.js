/*
 *
 * `collectProcessOptions`: `command-line-utils`.
 *
 */
const collectProcessOptionsSync = require("./collectProcessOptionsSync");

const collectProcessOptions = async () => {
  return Promise.resolve(collectProcessOptionsSync());
};

module.exports = collectProcessOptions;
