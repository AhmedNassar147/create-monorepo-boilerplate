/*
 *
 * `createHelpMessage`: `command-line-utils`.
 *
 */
const consoleColors = require("./consoleColors");

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

  console.log(
    consoleColors.fg.magenta,
    consoleColors.bright,
    `use this "${scriptName}" to ${description}.`,
  );

  console.log(consoleColors.reset, "");

  console.table(
    helpersKeys.map(({ description, keyOrKeys }) => {
      const isString = typeof keyOrKeys === "string";

      keyOrKeys = isString
        ? `--${keyOrKeys}`
        : keyOrKeys
            .map((key) => `--${key} `)
            .toString()
            .replace(",", " | ");

      return {
        key: keyOrKeys,
        description,
      };
    }),
  );
};

module.exports = createHelpMessage;
