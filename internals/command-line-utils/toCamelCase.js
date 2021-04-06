/*
 *
 * toCamelCase: `command-line-utils`.
 *
 */
const toCamelCase = (str) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

module.exports = toCamelCase;
