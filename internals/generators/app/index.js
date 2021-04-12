/*
 *
 * generator: `app`.
 *
 */
const defaultPrompts = require("../shared/defaultPrompts");
const { PROJECT_NAME_SPACE } = require("../../constants/base");

module.exports = {
  description: "Add app.",
  prompts: [...defaultPrompts(true)],
  actions: () => {
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
