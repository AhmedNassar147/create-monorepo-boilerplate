/*
 *
 * `isReactComponentSelected`: `utils`.
 *
 */
const { REACT_PACKAGE_TYPES } = require("../constants");

const isReactComponentSelected = (choiceProp) => {
  const { type } = choiceProp || {};

  return REACT_PACKAGE_TYPES.includes(type);
};

module.exports = isReactComponentSelected;
