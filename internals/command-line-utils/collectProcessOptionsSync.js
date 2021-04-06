/*
 *
 * `collectProcessOptionsSync`: `command-line-utils`.
 *
 */
const toCamelCase = require("./toCamelCase");

const collectProcessOptionsSync = () => {
  const argv = process.argv.slice(2) || [];

  if (!argv.length) {
    return {
      hasOptions: false,
    };
  }

  let computedArgs = {
    hasOptions: true,
    shouldDisplayHelpMessage: ["-h", "--h", "--help"].some((key) =>
      argv.includes(key),
    ),
  };

  const computedArgv = argv
    .toString()
    .replace(/-h|--h|--help/gim, "")
    .split(" ");

  computedArgv.forEach((key) => {
    key = key.replace(/\s/gm, "");
    const isBooleanOption = !key.includes("=");

    const [keyName, value] = (isBooleanOption ? ` ${key}=true` : key).split(
      "=",
    );

    let properKeyName = keyName.replace(/--|\s/g, "");
    // if it's name-param => nameParam
    // if it's --name => name
    properKeyName = toCamelCase(properKeyName);

    const valuesArray = value.split(",");

    const valueLength = valuesArray.length;
    const isOptionValueOption = valueLength === 1;

    const actualValue = isOptionValueOption ? valuesArray[0] : valuesArray;

    const valueIsBooleanString =
      isOptionValueOption &&
      ["true", "false"].includes(actualValue.toLowerCase());

    computedArgs[properKeyName] = valueIsBooleanString
      ? actualValue === "true"
        ? true
        : false
      : actualValue;
  });

  // yarn scriptName -h --filter=whatever
  // {
  //   filter: "whatever",
  //   shouldDisplayHelpMessage: true (-h)

  // }
  return computedArgs;
};

module.exports = collectProcessOptionsSync;
