/*
 *
 * `createHelpMessage`: `@domain/command-line-utils`.
 *
 */
const chalk = require("chalk");

const sharedHelperKey = {
  keyOrKeys: ["help", "h"],
  description: "see All options for this cli.",
};

const consoleRenderKeyOrKeys = (keyOrKeys) => {
  const isString = typeof keyOrKeys === "string";
  return isString
    ? `--${keyOrKeys}`
    : keyOrKeys
        .map((key) => `--${key}`)
        .toString()
        .replace(",", ", ") + "   ";
};

const createKeyWithDesc = ({ description, keyOrKeys, maxKeyLength }) => {
  keyOrKeys = consoleRenderKeyOrKeys(keyOrKeys);

  const keysLength = keyOrKeys.length;

  if (keysLength < maxKeyLength) {
    const diff = maxKeyLength - keysLength;
    for (let index = 0; index < diff; index++) {
      keyOrKeys += " ";
    }
  }

  return `${keyOrKeys} ${chalk.white(description)}\n`;
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

  const maxKeyLength = helpersKeys
    .reduce(
      (acc, { keyOrKeys }) => [
        ...acc,
        consoleRenderKeyOrKeys(keyOrKeys).length,
      ],
      [],
    )
    .reduce(
      (previous, current) => (current > previous ? current : previous),
      0,
    );

  console.log(
    `\n Usage: \`${scriptName}\` [flags] \n \n`,
    `Description: ${chalk.bold.cyan(description)}. \n \n`,
    "Displays help information [Options]: \n \n",
    ...helpersKeys.map((currentHelper) =>
      createKeyWithDesc({
        ...currentHelper,
        maxKeyLength,
      }),
    ),
  );
};

module.exports = createHelpMessage;
