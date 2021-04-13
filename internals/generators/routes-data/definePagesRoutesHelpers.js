/*
 *
 * definePagesRoutesHelpers
 *
 */
const getAllPageRoutesData = require("./getAllPageRoutesData");
const createArrayOfStringWithHandlebarBlocker = require("../utils/createArrayOfStringWithHandlebarBlocker");

function definePagesRoutesHelpers(plop) {
  plop.setHelper("createPagesData", getAllPageRoutesData);

  plop.setHelper("formatPageRoutePath", path => {
    const isTypeString = typeof path === "string";

    if (isTypeString) {
      return `"${path}"`;
    }

    const arrayOfPaths = createArrayOfStringWithHandlebarBlocker(path);

    return `[${arrayOfPaths.join("")}]`;
  });
}

module.exports = definePagesRoutesHelpers;
