/*
 *
 * `logMessage`: `@domain/serve`.
 *
 */
const chalk = require("chalk");
const { scriptName } = require("./constants");

module.exports = (msg) =>
  console.log(`${chalk.magenta(`[${scriptName}]:`)} ${msg}`);
