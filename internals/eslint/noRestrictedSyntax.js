/*
 *
 * `noRestrictedSyntax`: `eslint`.
 *
 */
const { PROJECT_NAME_SPACE } = require("../constants");

module.exports = [
  {
    selector:
      "MemberExpression[property.name=/a-z|_/i] > MemberExpression[object.name='process'][property.name='env']",
    message:
      "Don't use `process.env.xxx`, just the environment variable directly, unless you are in non compiled folder just disable the rule.",
  },
  {
    selector: "ImportDeclaration > Literal[value=/src/i]",
    message: `Do import a package with \`/src\` just the package name. like '${PROJECT_NAME_SPACE}/routes'.`,
  },
];
