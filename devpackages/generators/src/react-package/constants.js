/*
 *
 * Constants: `react-package`.
 *
 */
const REACT_PACKAGE_TYPES_KEYS = {
  normal: "normal-component",
  lazy: "lazy-loaded-component",
  page: "page",
};

const REACT_PAGE_TYPES_KEYS = {
  normal: "normal-page",
  table: "table-page",
};

const REACT_PACKAGE_TYPES = Object.values(REACT_PACKAGE_TYPES_KEYS);
const REACT_PAGE_TYPES = Object.values(REACT_PAGE_TYPES_KEYS);

const NEW_MODULE_WORKSPACE_KEY = "create new module workspace";
const NEW_PACKAGES_WORKSPACE_KEY = "create new packages workspace";

module.exports = {
  REACT_PACKAGE_TYPES,
  REACT_PACKAGE_TYPES_KEYS,
  REACT_PAGE_TYPES,
  REACT_PAGE_TYPES_KEYS,
  NEW_MODULE_WORKSPACE_KEY,
  NEW_PACKAGES_WORKSPACE_KEY,
};
