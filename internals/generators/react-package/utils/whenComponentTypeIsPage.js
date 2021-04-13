/*
 *
 * whenComponentTypeIsPage: `utils`.
 *
 */
const getTypeOfComponentPackage = require("./getTypeOfComponentPackage");

function whenComponentTypeIsPage({ type }) {
  const { isPage } = getTypeOfComponentPackage(type);
  return isPage;
}

module.exports = whenComponentTypeIsPage;
