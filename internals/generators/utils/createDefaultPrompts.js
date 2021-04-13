/*
 *
 * `createDefaultPrompts`: `utils`.
 *
 */
const packageExists = require("./packageExists");
const { PROJECT_NAME_SPACE } = require("../../constants/base");

const nameSpaceRegex = new RegExp(`^${PROJECT_NAME_SPACE}\/?.+`);

const getName = (generatingApp) => (generatingApp ? "app" : "package");

const createDefaultPrompts = (generatingApp) => [
  {
    type: "input",
    name: "name",
    message: "What should it be called?",
    default: "lorem-ipsum",
    validate: (value) => {
      if (/.+/.test(value)) {
        if (packageExists(value)) {
          return `The ${getName(generatingApp)} with this name already exists.`;
        }

        if (nameSpaceRegex.test(value)) {
          return `The ${getName(
            generatingApp,
          )} name should not start with \`${PROJECT_NAME_SPACE}\`, it is pre-filled.`;
        }

        if (generatingApp) {
          if (value.endsWith("app")) {
            return `The ${getName(
              generatingApp,
            )} name should not end with \`app\`, it is pre-filled.`;
          }
        }

        return true;
      }

      return "The name is required.";
    },
  },
  {
    type: "input",
    name: "description",
    message: `What is the description of the ${getName(generatingApp)}?`,
    validate: (value) => {
      if (/.+/.test(value)) {
        return true;
      }

      return "The description is required.";
    },
  },
];

module.exports = createDefaultPrompts;
