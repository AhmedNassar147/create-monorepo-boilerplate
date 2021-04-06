/*
 *
 * `createCliController`: `command-line-utils`.
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
  const {
    hasOptions,
    shouldDisplayHelpMessage,
    ...cliOptions
  } = await collectProcessOptions();

  if (shouldDisplayHelpMessage) {
    createHelpMessage({
      scriptName,
      description,
      helpersKeys,
    });

    return;
  }

  if (throwIfNoOptionSet && !hasOptions) {
    throw new Error(`
      Please set At lest set one option for this script ${scriptName}.
      Please run \`yarn ${scriptName} -h \` to see all available options.
    `);
  }

  if (runCliFn) {
    await runCliFn(cliOptions);
  }
};

module.exports = createCliController;
