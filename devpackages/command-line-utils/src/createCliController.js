/*
 *
 * `createCliController`: `@domain/command-line-utils`.
 *
 */
const chalk = require("chalk");
const createHelpMessage = require("./createHelpMessage");
const collectProcessOptions = require("./collectProcessOptions");

const createCliController = async ({
  scriptName,
  description,
  helpersKeys,
  throwIfNoOptionSet,
  runCliFn,
}) => {
  const { hasOptions, shouldDisplayHelpMessage, ...cliOptions } =
    await collectProcessOptions();

  if (throwIfNoOptionSet && !hasOptions) {
    console.log(
      chalk.magenta(`[${scriptName}:] `) +
        chalk.red(
          `requires at least one option, try ${chalk.white(
            `\`${scriptName} --h\``,
          )}`,
        ),
    );

    process.exit(1);
  }

  if (shouldDisplayHelpMessage) {
    createHelpMessage({
      scriptName,
      description,
      helpersKeys,
    });

    return;
  }

  if (runCliFn) {
    await runCliFn(cliOptions);
  }
};

module.exports = createCliController;
