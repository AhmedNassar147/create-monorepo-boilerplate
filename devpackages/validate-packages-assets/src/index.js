/*
 *
 * Package: `@domain/validate-packages-assets`.
 *
 */
const {
  validatePackagesAssets,
  scriptName,
} = require("./validatePackagesAssets");
const createCliController = require("../../../internals/command-line-utils/createCliController");

createCliController({
  scriptName,
  description: "validates assets used in given packages",
  helpersKeys: [
    {
      keyOrKeys: "packages",
      description:
        "could be package or multiple packages separated by commas (eg: --packages=some-package | --packages=pkg1,pkg2)",
    },
    {
      keyOrKeys: "logOnlyResults",
      description:
        "logs only mismatched assets paths if exists. (eg: --logOnlyResults)",
    },
  ],
  runCliFn: validatePackagesAssets,
});
