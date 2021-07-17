/*
 *
 * `createPageConfigRouteData`: `generateAppsRoutesConfig`.
 *
 */
const { invariant } = require("../../../scripts");

const createPageConfigRouteData = ({ routeData, name }) => {
  const { path, params, isDevelopmentOnlyPage } = routeData;

  invariant(
    path,
    `\`(createPageConfigRouteData)\`: Package ${name} should has \`path\` as \`string | string[]\`` +
      `inside  \`routeData\`.`,
  );

  return {
    path,
    pageIndexPath: name,
    params,
    isDevelopmentOnlyPage,
  };
};

module.exports = createPageConfigRouteData;
