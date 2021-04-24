/*
 *
 * react package: `@domain/generators`.
 *
 */
const { REACT_PACKAGE_TYPES /* REACT_PAGE_TYPES */ } = require("./constants");
const { NEW_CONTAINING_FOLDER_KEY } = require("./constants");
const getTypeOfComponentPackage = require("./utils/getTypeOfComponentPackage");
const whenComponentTypeIsPage = require("./utils/whenComponentTypeIsPage");
const toCamelCase = require("./utils/toCamelCase");
const afterCreationEvents = require("./utils/afterCreationEvents");
const createTsReferences = require("./utils/createTsReferences");
const createDefaultPrompts = require("../utils/createDefaultPrompts");
const getWorksSpacesOnlyNamesSync = require("../../workspaces/getWorksSpacesOnlyNamesSync");
const {
  PROJECT_NAME_SPACE,
  MODULES_REGEX,
  APPS_REGEX,
  PACKAGES_REGEX,
} = require("../../constants");

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
    // {
    //   type: "list",
    //   name: "pageType",
    //   when: whenComponentTypeIsPage,
    //   message: "Select the type of the page",
    //   default: "normal-page",
    //   choices: () => REACT_PAGE_TYPES,
    // },
    ...createDefaultPrompts(),
    {
      type: "input",
      name: "pagePath",
      when: canShowPathNameOptions,
      message: "Enter the initial page pathname for route data `path`.",
      default: ({ name }) => toCamelCase(name.replace(/-page/, ""), "-"),
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
      type: "list",
      name: "selectedContainingFolderWay",
      message: "where you want to place this package in?",
      choices: () => [
        "packages",
        NEW_CONTAINING_FOLDER_KEY,
        ...getWorksSpacesOnlyNamesSync(MODULES_REGEX),
      ],
      default: "packages",
    },
    {
      type: "input",
      name: "newModuleName",
      message: "what is the new module name?",
      when: ({ selectedContainingFolderWay }) =>
        selectedContainingFolderWay === NEW_CONTAINING_FOLDER_KEY,
      validate: (newModuleName) => {
        if (!newModuleName) {
          return "please type the new module name.";
        }

        if (!MODULES_REGEX.test(newModuleName || "")) {
          return `module name must ends with "-module"`;
        }

        return true;
      },
    },
    {
      type: "checkbox",
      name: "selectedApps",
      when: whenComponentTypeIsPage,
      message: "which apps will render this page?",
      choices: getWorksSpacesOnlyNamesSync(APPS_REGEX).map((name) => ({
        value: name,
      })),
      validate: (selectedApps) => {
        if (!selectedApps || !selectedApps.length) {
          return "Please select at least one app.";
        }

        return true;
      },
      default: [],
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
      selectedContainingFolderWay,
      newModuleName,
      selectedApps,
      name,
      useLabelsHooks,
    } = eventData;

    const { isLazy, isPage } = getTypeOfComponentPackage(type);

    const isPackageUsingLazyTech = isLazy || isPage;

    const packageContainingFolderPath =
      newModuleName || selectedContainingFolderWay;

    let properName = name;

    if (isPage && !properName.endsWith("-page")) {
      properName += "-page";
    }

    const packageBasePath = `../../${packageContainingFolderPath}/${properName}`;

    const uiComponentPath = isPackageUsingLazyTech
      ? "component.tsx"
      : "index.tsx";

    let events = [
      {
        type: "add",
        path: `${packageBasePath}/tsconfig.json`,
        templateFile: "react-package/templates/tsconfig.json.hbs",
        abortOnFail: true,
        data: {
          references: createTsReferences({
            useLabelsHooks,
            isLazy,
            isCurrentPackageInPackages: PACKAGES_REGEX.test(
              packageContainingFolderPath,
            ),
          }),
        },
      },
      {
        type: "add",
        path: `${packageBasePath}/package.json`,
        templateFile: "react-package/templates/package.json.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
          containingFolderPath: packageContainingFolderPath,
          properApps: selectedApps ? JSON.stringify(selectedApps) : false,
          properName,
        },
      },
      {
        type: "add",
        path: `${packageBasePath}/README.md`,
        templateFile: "react-package/templates/readme.md.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: `${packageBasePath}/src/${uiComponentPath}`,
        templateFile: "react-package/templates/component.tsx.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
          properName,
        },
      },
      {
        type: "add",
        path: `${packageBasePath}/src/index.interface.ts`,
        templateFile: "react-package/templates/index.interface.ts.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
          properName,
        },
      },
    ];

    if (isPackageUsingLazyTech) {
      events = events.concat({
        type: "add",
        path: `${packageBasePath}/src/index.ts`,
        templateFile: "react-package/templates/lazy.ts.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
          properName,
        },
      });
    }

    if (useStyledFile) {
      events = events.concat({
        type: "add",
        path: `${packageBasePath}/src/styled.ts`,
        templateFile: "react-package/templates/styled.ts.hbs",
        abortOnFail: true,
        data: {
          PROJECT_NAME_SPACE,
          properName,
        },
      });
    }

    if (isPage) {
      events = events.concat({
        type: "update-generated-routes",
        data: {
          apps: selectedApps,
        },
      });
    }

    return [
      ...events,
      ...afterCreationEvents({
        containingFolderPath: packageContainingFolderPath,
        updateWorkSpacesRoots: !!newModuleName,
        workspaceName: `${newModuleName}/*`,
        folderOrFileName: properName,
      }),
    ];
  },
};
