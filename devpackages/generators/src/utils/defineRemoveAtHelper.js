/*
 *
 * `defineRemoveAtHelper`: `utils`.
 *
 */
const {
  PACKAGE_FULL_NAME_REGEXP,
  PROJECT_NAME_SPACE,
} = require("../../../scripts");

const normalPageRegexp = /.+\//;

function defineRemoveAtHelper(plop) {
  plop.setHelper("removeAt", function (value) {
    value = value || "";

    const isPackage = PACKAGE_FULL_NAME_REGEXP.test(value);

    if (isPackage) {
      return value.replace(
        new RegExp(`${PROJECT_NAME_SPACE}/`),
        `${PROJECT_NAME_SPACE.replace("@", "")}.`,
      );
    }

    const matchesPage = normalPageRegexp.test(value);

    return matchesPage ? value.replace(normalPageRegexp, "pages.") : value;
  });
}

module.exports = defineRemoveAtHelper;
