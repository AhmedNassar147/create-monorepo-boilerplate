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

const NEW_CONTAINING_FOLDER_KEY = "create new module";

module.exports = {
  REACT_PACKAGE_TYPES,
  REACT_PACKAGE_TYPES_KEYS,
  REACT_PAGE_TYPES,
  REACT_PAGE_TYPES_KEYS,
  NEW_CONTAINING_FOLDER_KEY,
};
