/*
 *
 * definePageRouteRouteData: `utils`.
 *
 */

const createArrayOfStringWithHandlebarBlocker = require("./createArrayOfStringWithHandlebarBlocker");
const removePageSuffixFromString = require("./removePageSuffixFromString");

function definePageRouteRouteData(plop) {
  plop.setHelper("extractPagePath", removePageSuffixFromString);

  plop.setHelper("properPageParams", function (pageParams) {
    const [comma, space] = [",", " "];

    if (pageParams.includes(comma)) {
      return createArrayOfStringWithHandlebarBlocker(pageParams, comma);
    }

    if (pageParams.includes(space)) {
      return createArrayOfStringWithHandlebarBlocker(pageParams, space);
    }

    return createArrayOfStringWithHandlebarBlocker([pageParams]);
  });
}

module.exports = definePageRouteRouteData;
