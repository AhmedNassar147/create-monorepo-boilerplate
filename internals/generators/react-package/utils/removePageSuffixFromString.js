/*
 *
 * `removePageSuffixFromString`: `utils`.
 *
 */
function removePageSuffixFromString(valueString) {
  return valueString.replace(/-page/, "");
}

module.exports = removePageSuffixFromString;
