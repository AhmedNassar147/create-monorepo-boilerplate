/*
 *
 * `createAppRoutesConfig`: `generateAppsRoutesConfig`.
 *
 */
const createPageConfigRouteData = require("./createPageConfigRouteData");

const createAppRoutesConfig = (pagesData) => {
  const routesConfigFromPagesData = pagesData.map(createPageConfigRouteData);

  return routesConfigFromPagesData.reduce(
    (acc, { isDevelopmentOnlyPage, ...routeConfigData }) => {
      if (isDevelopmentOnlyPage) {
        const hasDevPages = !!acc[1];

        if (!hasDevPages) {
          acc[1] = [];
        }

        acc[1] = [...acc[1], routeConfigData];

        return acc;
      }

      acc[0] = [...acc[0], routeConfigData];

      return acc;
    },
    [[]],
  );
};

module.exports = createAppRoutesConfig;
