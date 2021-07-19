/*
 *
 * `createCliController`: `@domain/command-line-utils`.
 *
 */
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
    throw new Error(`
      Please set At lest set one option for this script ${scriptName}.
      Please run \`yarn ${scriptName} -h || ${scriptName} -h \` to see available options.
    `);
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
