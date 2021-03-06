/*
 *
 * Constants: `@domain/validate-packages-deps`.
 *
 */
const removeComments = /^\/\/.+/gim;
const removeLineBreaksAndSpaces = /[\s|\n]/g;
const allImportsRegexp =
  /^import.+[\n|\s|\w|,|\s|}|'|"|.|/]*;|import\(\W.+\w.+\)/gim;

const charsAndImportsRegex = /.+from|'|"|;|,|import|\(|'|"|(\s)?\)|\s*/gim;
const removeWebpackCommentsRegex = /\/\*\s*[webpackChunkName:].+\s*?.+\*\//gim;
const ignoredPathsRegex =
  /(\.jpg)|(\.png)|(\.jpeg)|(\.svg)|(\.css)|(\.d.ts)|(\.json)/gm;

const scriptName = "domain-validate-packages-deps";

const cliOptions = {
  scriptName,
  description: "validates packages dependencies",
  helpersKeys: [
    {
      keyOrKeys: "filter",
      description:
        "only validate given package name. (--filter=lorem-ipsum-page or --filter=@domain/lorem-ipsum-page)",
    },
    {
      keyOrKeys: "exitKey",
      description:
        "fires process exit with given exitKey if found mismatched dependencies. (--exitKey=0)",
    },
    {
      keyOrKeys: "logOnlyResults",
      description:
        "logs only mismatched dependencies if exists. (--logOnlyResults)",
    },
  ],
};

module.exports = {
  removeLineBreaksAndSpaces,
  removeComments,
  allImportsRegexp,
  charsAndImportsRegex,
  removeWebpackCommentsRegex,
  ignoredPathsRegex,
  scriptName,
  cliOptions,
};
