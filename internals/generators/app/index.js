/*
 *
 * generator: `app`.
 *
 */
const createDefaultPrompts = require("../utils/createDefaultPrompts");
const { PROJECT_NAME_SPACE } = require("../../constants/base");
const selectAllModules = require("../../workspaces/selectAllModules");

const modulesName = selectAllModules();

module.exports = {
  description: "Add app.",
  prompts: [
    ...createDefaultPrompts(true),
    {
      type: "checkbox",
      name: "modules",
      message: `What are the modules, those render in the current app?`,
      choices: modulesName.map((name) => ({
        value: name,
      })),
      default: modulesName.length === 1 ? modulesName : [],
    },
  ],
  actions: ({ modules }) => {
    let events = [
      {
        type: "add",
        path: "../../{{name}}-app/public/index.html",
        templateFile: "app/html.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "../../{{name}}-app/src/index.tsx",
        templateFile: "app/src.index.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      },
      {
        type: "add",
        path: "../../{{name}}-app/package.json",
        templateFile: "app/pkg.json.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      },
      {
        type: "add",
        path: "../../{{name}}-app/tsconfig.json",
        templateFile: "app/tsconfig.json.hbs",
        abortOnFail: true,
      },
      {
        type: "prettify-app",
        abortOnFail: true,
      },
      {
        type: "update-yarn-lerna-root-workspaces",
        abortOnFail: true,
      },
    ];

    return [...events];
  },
};
