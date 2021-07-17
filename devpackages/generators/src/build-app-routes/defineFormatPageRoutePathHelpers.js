/*
 *
 * defineFormatPageRoutePathHelpers
 *
 */
const createArrayOfStringWithHandlebarBlocker = require("../react-package/utils/createArrayOfStringWithHandlebarBlocker");

function defineFormatPageRoutePathHelpers(plop) {
  plop.setHelper("formatPageRoutePath", (path) => {
    const isTypeString = typeof path === "string";

    if (isTypeString) {
      return `"${path}"`;
    }

    const arrayOfPaths = createArrayOfStringWithHandlebarBlocker(path);

    return `[${arrayOfPaths.join("")}]`;
  });
}

module.exports = defineFormatPageRoutePathHelpers;
