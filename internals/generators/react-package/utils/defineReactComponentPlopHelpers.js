/*
 *
 * `defineReactComponentPlopHelpers`: `utils`.
 *
 */
const isReactComponentSelected = require("./isReactComponentSelected");
const { REACT_PACKAGE_TYPES_KEYS } = require("../constants");

const { page, lazy, normal } = REACT_PACKAGE_TYPES_KEYS;

function defineReactComponentPlopHelpers(plop) {
  plop.setHelper("isReactPackage", function (type) {
    return isReactComponentSelected({ type });
  });

  plop.setHelper("removeAt", function (value) {
    return (value || "").replace(/@/, "");
  });

  [
    ["isPage", page],
    ["isLazy", lazy],
    ["isNormal", normal],
  ].map(([helperName, propName]) => {
    plop.setHelper(helperName, function (type) {
      return type === propName;
    });
  });
}

module.exports = defineReactComponentPlopHelpers;
