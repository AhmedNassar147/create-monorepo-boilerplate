/*
 *
 * `preparePrettier`: `@domain/precommit-linter`.
 *
 */
const { exec } = require("child_process");
const { promisify } = require("util");
const chalk = require("chalk");
const createCliLogMessage = require("./createCliLogMessage");

const execAsync = promisify(exec);

const preparePrettier = async (stagedFiles) => {
  const prettierPromises = stagedFiles.map(async (file) => {
    const { stderr: nodeError } = await execAsync(
      `./node_modules/.bin/prettier --write "${file}"`,
    );

    console.log(
      createCliLogMessage(
        chalk.white(`${chalk.bold.green("prettify")} ${file}`),
      ),
    );

    return nodeError;
  });

  const prettierNodeErrors = (await Promise.all(prettierPromises)).filter(
    Boolean,
  );

  if (prettierNodeErrors.length) {
    process.emit("onError", prettierNodeErrors);
  }

  console.log(
    createCliLogMessage(
      chalk.bold.magenta("prettier finished successfully ✨✨"),
    ),
  );
};

module.exports = preparePrettier;
