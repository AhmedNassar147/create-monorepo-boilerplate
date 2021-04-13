/*
 *
 * react package: `@app-structure/generators`.
 *
 */
const { REACT_PACKAGE_TYPES, REACT_PAGE_TYPES } = require("./constants");
const getTypeOfComponentPackage = require("./utils/getTypeOfComponentPackage");
const whenComponentTypeIsPage = require("./utils/whenComponentTypeIsPage");
const createDefaultPrompts = require("../utils/createDefaultPrompts");
const toCamelCase = require("./utils/toCamelCase");
const afterCreationEvents = require("./utils/afterCreationEvents");
const selectAllModules = require("../../workspaces/selectAllModules");
const { PROJECT_NAME_SPACE, MODULES_REGEX } = require("../../constants/base");

const modulesNames = selectAllModules();

const canShowPathNameOptions = ({ type }) => {
  const { isPage } = getTypeOfComponentPackage(type);
  return isPage;
};

module.exports = {
  description: "Add a react component package",
  prompts: [
    {
      type: "list",
      name: "type",
      message: "Select the type of the package",
      default: "normal-component",
      choices: () => REACT_PACKAGE_TYPES,
    },
    {
      type: "list",
      name: "pageType",
      when: whenComponentTypeIsPage,
      message: "Select the type of the page",
      default: "normal-page",
      choices: () => REACT_PAGE_TYPES,
    },
    ...createDefaultPrompts(),
    {
      type: "input",
      name: "pagePath",
      when: canShowPathNameOptions,
      message: "Enter the initial page pathname for route data `path`.",
      default: ({ name }) => toCamelCase(name, "-"),
    },
    {
      type: "input",
      name: "pageParams",
      when: whenComponentTypeIsPage,
      message: `Enter params for route data \`params\`.
        ---Notes-- params should be string and if it's more than one it should be separated by commas.
        (Example): someparam,anotherparam`,
      default: "",
      validate: (pageParams) => {
        if (pageParams) {
          const hasArrayOpenBracket = pageParams.startsWith("[");
          const hasArrayCloseBracket = pageParams.endsWith("]");

          if (hasArrayOpenBracket || hasArrayCloseBracket) {
            return `pageParams shouldn't start or end with "[" or "]"`;
          }
        }

        return true;
      },
    },
    {
      type: "confirm",
      name: "isPlacedInsidePackages",
      message: "set this package inside packages folder?",
      default: true,
    },
    {
      type: !modulesNames.length ? "input" : "list",
      name: "selectedModule",
      message: "type/select the module that includes this package.",
      when: ({ isPlacedInsidePackages }) => !isPlacedInsidePackages,
      ...(modulesNames.length ? { choices: () => modulesNames } : null),
      validate: (selectedModule) => {
        if (!selectedModule) {
          return "please type/select the module name.";
        }

        if (!MODULES_REGEX.test(selectedModule || "")) {
          return `module name must ends with "-module"`;
        }

        return true;
      },
    },
    {
      type: "confirm",
      name: "useLabelsHooks",
      default: true,
      message: "include labels `useLabelsHooks` in current package ?",
    },
    {
      type: "confirm",
      name: "useStyledFile",
      default: true,
      message: "you want a styled file for this package ?",
    },
  ],
  actions: (eventData) => {
    const {
      useStyledFile,
      type,
      isPlacedInsidePackages,
      selectedModule,
    } = eventData;

    const { isLazy, isPage } = getTypeOfComponentPackage(type);

    const isPackageUsingLazyTech = isLazy || isPage;

    const packageContainingFolderPath = isPlacedInsidePackages
      ? "packages"
      : selectedModule;

    const packageBasePath = `../../${packageContainingFolderPath}/{{name}}`;

    const uiComponentPath = isPackageUsingLazyTech
      ? "component.tsx"
      : "index.tsx";

    let events = [
      {
        type: "add",
        path: `${packageBasePath}/tsconfig.json`,
        templateFile: "react-package/tsconfig.json.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: `${packageBasePath}/package.json`,
        templateFile: "react-package/package.json.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
          containingFolderPath: packageContainingFolderPath,
        },
      },
      {
        type: "add",
        path: `${packageBasePath}/README.md`,
        templateFile: "react-package/readme.md.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: `${packageBasePath}/src/${uiComponentPath}`,
        templateFile: "react-package/component.tsx.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      },
    ];

    if (isPackageUsingLazyTech) {
      events = events.concat({
        type: "add",
        path: `${packageBasePath}/src/index.ts`,
        templateFile: "react-package/lazy.ts.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      });
    }

    if (useStyledFile) {
      events = events.concat({
        type: "add",
        path: `${packageBasePath}/src/styled.ts`,
        templateFile: "react-package/styled.ts.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
        },
      });
    }

    if (isPage) {
      // events = events.concat({
      //   type: "update-generated-routes",
      // });
    }

    return [
      ...events,
      ...afterCreationEvents({
        containingFolderPath: packageContainingFolderPath,
      }),
    ];
  },
};
