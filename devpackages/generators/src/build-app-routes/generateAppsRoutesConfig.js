/*
 *
 * Index: `generateAppsRoutesConfig`.
 *
 */
const chalk = require("chalk");
const generateAppRoutesConfigFile = require("./generateAppRoutesConfigFile");
const {
  invariant,
  APPS_REGEX,
  getWorkSpacesData,
} = require("../../../scripts");

const generateAppsRoutesConfig = ({ filter }) => {
  invariant(
    filter ? APPS_REGEX.test(filter) : true,
    `\`(generateAppsRoutesConfig):\` you have passed the "filter" option with non proper app name ` +
      `given filter="${filter}"`,
  );

  let allPagesPackages = getWorkSpacesData({
    onlyPages: true,
  });

  if (filter) {
    const keys = Object.keys(allPagesPackages);
    allPagesPackages = keys.reduce((acc, packageName) => {
      const { routeData } = allPagesPackages[packageName];
      const { apps } = routeData;

      console.log(
        chalk.magenta(
          `[generateAppsRoutesConfig => (${filter})]: collect route data from ${packageName}`,
        ),
      );

      invariant(
        apps ? !!apps.length : !!apps,
        `\`(generateAppsRoutesConfig):\` "apps" must be array of app names in ${packageName} ` +
          `package.json/routeData found "${apps}"`,
      );

      if (apps && apps.includes(filter)) {
        acc[packageName] = { routeData };
      }
      return acc;
    }, {});
  }

  const pagesKeys = Object.keys(allPagesPackages);

  if (!pagesKeys.length) {
    console.log(chalk.red(`[generateAppsRoutesConfig]: no pages found.`));

    return;
  }

  let appsPages = {};

  pagesKeys.forEach((packageName) => {
    const { routeData } = allPagesPackages[packageName];
    const { apps, ...rest } = routeData;

    apps.forEach((appName) => {
      appsPages = {
        ...appsPages,
        [appName]: [
          ...(appsPages[appName] || []),
          {
            name: packageName,
            routeData: rest,
          },
        ],
      };
    });
  });

  Object.keys(appsPages).forEach((appName) => {
    generateAppRoutesConfigFile(appName, appsPages[appName]);
  });
};

module.exports = generateAppsRoutesConfig;
