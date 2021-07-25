/*
 *
 * `logMessage`: `@domain/scripts`.
 *
 */
const chalk = require("chalk");

module.exports =
  (scriptName) =>
  (msg, exit, exitWithCode = 1) => {
    console.log(
      `${chalk.magenta(`[${scriptName}]:`)} ${
        exit && exitWithCode === 1 ? chalk.red(msg) : msg
      }`,
    );

    if (exit) {
      process.exit(exitWithCode);
    }
  };
