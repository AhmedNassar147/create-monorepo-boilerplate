/*
 *
 * `collectProcessOptionsSync`: `@domain/command-line-utils`.
 *
 */
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
    .split("--")
    .filter(Boolean);

  computedArgv.forEach((key) => {
    key = key.replace(/\s/g, "");
    const isBooleanOption = !key.includes("=");

    let [keyName, value] = (isBooleanOption ? ` ${key}=true` : key).split("=");

    if (value.endsWith(",")) {
      value[value.length - 1] = "";
    }

    let properKeyName = keyName.replace(/--|\s/g, "");
    const valuesArray = value.split(",").filter(Boolean);

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
