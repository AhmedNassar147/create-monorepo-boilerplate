/*
 *
 * `createCliLogMessage`: `@domain/precommit-linter`.
 *
 */
const chalk = require("chalk");

const createCliLogMessage = (msg) =>
  `${chalk.magenta("[precommit-linter]: ")} ${msg}`;

module.exports = createCliLogMessage;
