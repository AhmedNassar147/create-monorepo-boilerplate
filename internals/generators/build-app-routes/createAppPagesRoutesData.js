/*
 *
 * `createAppPagesRoutesData`: `build-app-routes`.
 *
 */
const processPath = require("./processPath");

const DEFAULT_RESULT = {
  routerPagesData: [],
  pathNames: {},
};

const createAppPagesRoutesData = (pagesRoutesConfig) => {
  if (!pagesRoutesConfig || !pagesRoutesConfig.length) {
    return DEFAULT_RESULT;
  }

  return pagesRoutesConfig.reduce((acc, { path, params, pageIndexPath }) => {
    const isPathArray = Array.isArray(path);
    let pageName = path;

    if (isPathArray) {
      const isLoginPage = /login/.test(path.toString());
      pageName = path[isLoginPage ? 1 : 0];
    }

    const properPageName = pageName.replace(/\//g, "");
    const routePath = processPath(path, params);

    const routerData = [
      ...acc.routerPagesData,
      {
        pageName: properPageName,
        pageIndexPath,
      },
    ];

    const routerPathNamesData = {
      ...acc.pathNames,
      [properPageName]: routePath,
    };

    return {
      routerPagesData: routerData,
      pathNames: routerPathNamesData,
    };
  }, DEFAULT_RESULT);
};

module.exports = createAppPagesRoutesData;
