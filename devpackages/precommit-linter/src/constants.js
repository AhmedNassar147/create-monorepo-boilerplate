/*
 *
 * Constants: `@domain/precommit-linter`.
 *
 */
const filesExtensionToLint = /\.(tsx|js|ts)$/;
const ignoredFilesRegexp =
  /^\.(\w.+ignore|.production)|\.editorconfig|.gitattributes|(typings\/.+.d.ts)|env|sh|lock|hbs|assets\/\w.+|husky(\/.+)?$/;

module.exports = {
  filesExtensionToLint,
  ignoredFilesRegexp,
};
