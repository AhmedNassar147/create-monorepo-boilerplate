/*
 *
 * `logMessage`: `@domain/install-bins`.
 *
 */
const chalk = require("chalk");

module.exports = (msg, exit, exitWithCode = 1) => {
  console.log(
    `${chalk.magenta(`[install-bins]:`)} ${
      exit && exitWithCode === 1 ? chalk.red(msg) : msg
    }`,
  );

  if (exit) {
    process.exit(exitWithCode);
  }
};
