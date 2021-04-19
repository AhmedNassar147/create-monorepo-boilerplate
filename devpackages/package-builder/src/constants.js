/*
 *
 * Constants: `@domain/package-builder`.
 *
 */
const cliOptions = {
  scriptName: "package-builder",
  description: "builds a package with babel to 'esm' and 'cjs' formats",
  helpersKeys: [
    {
      keyOrKeys: "packageName",
      description: "build a package by name (required)",
    },
    {
      keyOrKeys: "watch",
      description: "watch and build changed files in given package.",
    },
    {
      keyOrKeys: "force",
      description:
        "force the builder to ignore previous build and build the given package",
    },
  ],
};

module.exports = {
  cliOptions,
};
