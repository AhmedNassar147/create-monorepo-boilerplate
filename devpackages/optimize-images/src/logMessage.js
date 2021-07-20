/*
 *
 * `logMessage`: `@domain/optimize-images`.
 *
 */
const chalk = require("chalk");
const { scriptName } = require("./constants");

module.exports = (msg, exit, exitWithCode = 1) => {
  console.log(
    `${chalk.magenta(`[${scriptName}]:`)} ${
      exit && exitWithCode === 1 ? chalk.red(msg) : msg
    }`,
  );

  if (exit) {
    process.exit(exitWithCode);
  }
};
