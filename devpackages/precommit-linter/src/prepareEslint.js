/*
 *
 * `prepareEslint`: `@domain/precommit-linter`.
 *
 */
const { exec } = require("child_process");
const { promisify } = require("util");
const chalk = require("chalk");
const createCliLogMessage = require("./createCliLogMessage");
const { isWindowsPlatform } = require("../../scripts");

const execAsync = promisify(exec);

const prepareEslint = async (eslintFiles) => {
  console.log(createCliLogMessage(chalk.bold.white("getting eslint started.")));

  const linterPromises = eslintFiles.map(async (file) => {
    let result = "";

    try {
      const { stdout: eslintError, stderr: nodeError } = await execAsync(
        `./node_modules/.bin/eslint "${file}"`,
        isWindowsPlatform()
          ? {
              shell: "powershell.exe",
            }
          : undefined,
      );

      console.log(
        createCliLogMessage(
          chalk.white(`${chalk.bold.green("linting")} ${file}`),
        ),
      );

      result = eslintError || nodeError;
    } catch (error) {
      // const stdOutRegexp = /stdout.+[\s|\r|\n|\W|\w]*,$/gim;
      result = typeof error === "object" ? error.stdout || error.stderr : error;
    }

    return result;
  });

  const linterErrors = (await Promise.all(linterPromises)).filter(Boolean);

  if (linterErrors.length) {
    process.emit("onError", linterErrors);
  }

  console.log(
    createCliLogMessage(
      chalk.bold.magenta("eslint finished successfully ✨✨"),
    ),
  );
};

module.exports = prepareEslint;
