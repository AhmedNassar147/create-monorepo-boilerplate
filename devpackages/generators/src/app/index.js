/*
 *
 * generator: `app`.
 *
 */
const createDefaultPrompts = require("../utils/createDefaultPrompts");
const createRootWorkSpacesEvent = require("../utils/createRootWorkSpacesEvent");
const {
  getWorkSpacesData,
  PROJECT_NAME_SPACE,
  PACKAGES_MODULES_REGEX,
  findRootYarnWorkSpaces,
} = require("../../../scripts");

const projectRoot = findRootYarnWorkSpaces();

module.exports = {
  description: "Add app.",
  prompts: [
    ...createDefaultPrompts(true),
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
      validate: (selectedPages) => {
        if (!selectedPages || !selectedPages.length) {
          return "please at least select one page.";
        }

        return true;
      },
      default: [],
    },
    {
      type: "confirm",
      name: "useInternalRoutesFile",
      default: false,
      message: "does this app uses internal routes config file ?",
    },
  ],
  actions: ({ name, useInternalRoutesFile }) => {
    const realAppName = `${name}-app`;
    const basePath = `${projectRoot}/${realAppName}`;

    const events = [
      {
        type: "add",
        path: `${basePath}/public/index.html`,
        templateFile: "app/templates/html.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: `${basePath}/src/index.tsx`,
        templateFile: "app/templates/src.index.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      },
      {
        type: "add",
        path: `${basePath}/tsconfig.json`,
        templateFile: "app/templates/tsconfig.json.hbs",
        abortOnFail: true,
      },
      ...(useInternalRoutesFile
        ? [
            {
              type: "add",
              path: `${basePath}/internal-routes-config.json`,
              templateFile: "app/templates/internal-routes-config.json.hbs",
              abortOnFail: true,
            },
          ]
        : []),
      {
        type: "prettify",
        data: {
          folderOrFileName: realAppName,
        },
        abortOnFail: true,
      },
      createRootWorkSpacesEvent(realAppName),
      {
        type: "update-pages-routes-data-with-app",
      },
      {
        type: "update-generated-routes",
        data: {
          apps: [realAppName],
        },
      },
    ];

    return events;
  },
};
