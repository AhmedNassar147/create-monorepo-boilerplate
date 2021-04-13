/*
 *
 * toCamelCase: `utils`.
 *
 */
const removePageSuffixFromString = require("./removePageSuffixFromString");

function toCamelCase(stringValue, separator) {
  if (!separator) {
    return stringValue;
  }

  stringValue = removePageSuffixFromString(stringValue);

  let arrayFromString = stringValue.split(separator);

  arrayFromString = arrayFromString.map((value, index) => {
    if (index) {
      return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    return value;
  });

  return arrayFromString.join("");
}

module.exports = toCamelCase;
