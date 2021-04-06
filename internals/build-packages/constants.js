/*
 *
 * Constants: `build-packages`.
 *
 */
const { sharedHelperKey } = require("../command-line-utils");

const scriptName = "build-libs";

const cliOptions = {
  scriptName,
  description: "type checking given lib/s and build them with vite.",
  helpersKeys: [
    sharedHelperKey,
    {
      keyOrKeys: "workspace",
      description:
        "the workspace that contains the packages to be built. (--workspace=packages)",
    },
    {
      keyOrKeys: "filter",
      description:
        "if not set the cli will build all packages in the workspace " +
        "you can filter by package name or group of them with regexp " +
        "(--filter=pkg1 or --filter=/pkg1|pkg1/)",
    },
  ],
};

module.exports = {
  cliOptions,
};
