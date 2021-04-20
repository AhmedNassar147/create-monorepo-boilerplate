/*
 *
 * generator: `app`.
 *
 */
const createDefaultPrompts = require("../utils/createDefaultPrompts");
const {
  PROJECT_NAME_SPACE,
  PACKAGES_MODULES_REGEX,
} = require("../../constants/base");
const createRootWorkSpacesEvent = require("../utils/createRootWorkSpacesEvent");
const getWorkSpacesData = require("../../workspaces/getWorkSpacesData");

module.exports = {
  description: "Add app.",
  prompts: [
    ...createDefaultPrompts(true),
    {
      type: "confirm",
      name: "needsToAddPages",
      message: "Do you want to add pages to this app?",
      default: false,
    },
    {
      type: "checkbox",
      name: "selectedPages",
      message: "select pages to render in this app",
      choices: () => {
        const pages = getWorkSpacesData({
          onlyTheseWorkSpacesNamesRegex: PACKAGES_MODULES_REGEX,
          onlyPages: true,
        });

        return Object.keys(pages).map((packageName) => ({
          value: pages[packageName].packagePath,
          name: packageName,
        }));
      },
      default: [],
    },
  ],
  actions: ({ name, selectedPages }) => {
    const realAppName = `${name}-app`;

    // const appRoutesJsonConfigFilePath = join(
    //   process.cwd(),
    //   "internals",
    //   "generateAppsRoutesConfig",
    //   "generated",
    //   `${appName}.json`,
    // );

    let events = [
      {
        type: "add",
        path: `../../${realAppName}/public/index.html`,
        templateFile: "app/templates/html.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: `../../${realAppName}/src/index.tsx`,
        templateFile: "app/templates/src.index.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      },
      {
        type: "add",
        path: `../../${realAppName}/src/app.tsx`,
        templateFile: "app/templates/src.app.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      },
      // {
      //   type: "add",
      //   path: "../../${realAppName}/package.json",
      //   templateFile: "app/pkg.json.hbs",
      //   abortOnFail: true,
      //   data: {
      //     PROJECT_NAME_SPACE,
      //   },
      // },
      {
        type: "add",
        path: `../../${realAppName}/tsconfig.json`,
        templateFile: "app/templates/tsconfig.json.hbs",
        abortOnFail: true,
      },
      {
        type: "prettify",
        data: {
          folderOrFileName: realAppName,
        },
        abortOnFail: true,
      },
      createRootWorkSpacesEvent(realAppName),
    ];

    if (selectedPages && selectedPages.length) {
      events.push({
        type: "update-pages-routes-data-with-app",
      });
    }

    // events.push({
    //   type: "update-generated-routes",
    //   data: {
    //     apps: [realAppName],
    //   },
    // });

    return [...events];
  },
};
