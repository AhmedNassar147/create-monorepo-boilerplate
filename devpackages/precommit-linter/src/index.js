/*
 *
 * Package: `@domain/precommit-linter`.
 *
 */
const chalk = require("chalk");
const getStagedFiles = require("./getStagedFiles");
const preparePrettier = require("./preparePrettier");
const prepareEslint = require("./prepareEslint");
const createCliLogMessage = require("./createCliLogMessage");
const prepareDependenciesValidator = require("./prepareDependenciesValidator");
const { filesExtensionToLint } = require("./constants");

const preCommitLinter = async () => {
  process.on("onError", (error) => {
    if (error) {
      error = Array.isArray(error)
        ? error.map((err) => {
            err = err.replace(/\n/, "");

            return err ? createCliLogMessage(`${chalk.red(err)}\n`) : false;
          })
        : [createCliLogMessage(`${chalk.red(error)}\n`)];

      console.log(...error.filter(Boolean));
    }

    process.exit(1);
  });

  const stagedFiles = getStagedFiles();
  const stagedFilesLength = stagedFiles.length;

  if (!stagedFilesLength) {
    console.log(
      createCliLogMessage(
        chalk.white(`skipping process, no staged files found.`),
      ),
    );
    process.exit(0);
  }

  await preparePrettier(stagedFiles);

  const eslintFiles = stagedFiles.filter((file) =>
    filesExtensionToLint.test(file),
  );

  if (eslintFiles.length) {
    await prepareEslint(eslintFiles);
  } else {
    console.log(
      createCliLogMessage(
        chalk.bold.cyan(
          `skipping eslint, no files matched ${filesExtensionToLint} .`,
        ),
      ),
    );
  }

  prepareDependenciesValidator(stagedFiles);
};

module.exports = preCommitLinter;
