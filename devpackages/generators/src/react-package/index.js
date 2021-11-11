/*
 *
 * react package: `@domain/generators`.
 *
 */
const {
  NEW_MODULE_WORKSPACE_KEY,
  NEW_PACKAGES_WORKSPACE_KEY,
  REACT_PACKAGE_TYPES /* ,REACT_PAGE_TYPES */,
} = require("./constants");
const getTypeOfComponentPackage = require("./utils/getTypeOfComponentPackage");
const whenComponentTypeIsPage = require("./utils/whenComponentTypeIsPage");
const toCamelCase = require("./utils/toCamelCase");
const afterCreationEvents = require("./utils/afterCreationEvents");
const createTsReferences = require("./utils/createTsReferences");
const createDefaultPrompts = require("../utils/createDefaultPrompts");
const {
  getWorksSpacesOnlyNamesSync,
  PROJECT_NAME_SPACE,
  MODULES_REGEX,
  APPS_REGEX,
  PACKAGES_REGEX,
  PACKAGES_MODULES_REGEX,
  NEW_PACKAGES_WORKSPACE_REGEX,
  findRootYarnWorkSpaces,
} = require("../../../scripts");

const projectRoot = findRootYarnWorkSpaces();

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
      message: "where you want to place this package?",
      choices: () => [
        ...getWorksSpacesOnlyNamesSync(PACKAGES_MODULES_REGEX),
        NEW_PACKAGES_WORKSPACE_KEY,
        NEW_MODULE_WORKSPACE_KEY,
      ],
      default: "packages",
    },
    {
      type: "input",
      name: "newWorkspaceName",
      message: "what is the new workspace name?",
      when: ({ selectedContainingFolderWay }) =>
        [NEW_MODULE_WORKSPACE_KEY, NEW_PACKAGES_WORKSPACE_KEY].includes(
          selectedContainingFolderWay,
        ),
      validate: (newWorkspaceName, previousOptions) => {
        const { selectedContainingFolderWay } = previousOptions;

        const isNewModuleWorkspace =
          selectedContainingFolderWay === NEW_MODULE_WORKSPACE_KEY;

        if (!newWorkspaceName) {
          return `please type the new ${
            isNewModuleWorkspace ? "module" : "packages folder"
          } name.`;
        }

        const nameRegexp = isNewModuleWorkspace
          ? MODULES_REGEX
          : NEW_PACKAGES_WORKSPACE_REGEX;

        if (!nameRegexp.test(newWorkspaceName)) {
          return isNewModuleWorkspace
            ? 'module name must ends with "-module"'
            : 'a new packages folder must ends with "packages"';
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
      newWorkspaceName,
      selectedApps,
      name,
      useLabelsHooks,
    } = eventData;

    const { isLazy, isPage } = getTypeOfComponentPackage(type);

    const packageContainingFolderPath =
      newWorkspaceName || selectedContainingFolderWay;

    let properName = name;

    if (isPage && !properName.endsWith("-page")) {
      properName += "-page";
    }

    const packageBasePath = `${projectRoot}/${packageContainingFolderPath}/${properName}`;

    const uiComponentPath = isLazy ? "component.tsx" : "index.tsx";

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
        data: {
          PROJECT_NAME_SPACE,
          properName,
        },
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

    if (isLazy) {
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
        updateWorkSpacesRoots: !!newWorkspaceName,
        workspaceName: `${newWorkspaceName}/*`,
        folderOrFileName: properName,
      }),
    ];
  },
};
