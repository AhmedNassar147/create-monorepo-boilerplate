/*
 *
 * `createHelpMessage`: `command-line-utils`.
 *
 */
const chalk = require("chalk");
const sharedHelperKey = {
  keyOrKeys: ["help", "h"],
  description: "to See All options for this cli.",
};

const createKeyWithDesc = ({ description, keyOrKeys }) => {
  const isString = typeof keyOrKeys === "string";
  keyOrKeys = isString
    ? `--${keyOrKeys}`
    : keyOrKeys
        .map((key) => `--${key} `)
        .toString()
        .replace(",", "| ");

  return ` ${chalk.keyword("orange")(keyOrKeys)}         ${chalk.white(
    description,
  )}\n`;
};

const createHelpMessage = ({ scriptName, description, helpersKeys }) => {
  if (!scriptName) {
    throw new Error(
      `Please Provide the script Name, given scriptName=${scriptName}`,
    );
  }

  if (!description) {
    throw new Error(
      `Please Provide the description, given description=${description}`,
    );
  }

  if (!(helpersKeys && helpersKeys.length)) {
    throw new Error(
      `Please Provide the helpersKeys, given helpersKeys=${helpersKeys}`,
    );
  }

  helpersKeys = [...helpersKeys, sharedHelperKey];

  console.log(chalk.bold.cyan(` Usage (${scriptName}): ${description}.\n`));

  console.log(...helpersKeys.map(createKeyWithDesc));
};

module.exports = createHelpMessage;
