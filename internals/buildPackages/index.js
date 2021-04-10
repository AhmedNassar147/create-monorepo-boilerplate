/*
 *
 * Index: `buildPackage`.
 *
 */
const { createCliController } = require("../command-line-utils");
const { cliOptions } = require("./constants");
const buildPackage = require("./buildPackage");

const runCli = async () => {
  const argv = process.argv;
  const basePackagePathArg = argv[argv.length - 1];

  const properKeyName = basePackagePathArg.replace(/--|\s/g, "");

  const basePackageRootPath = properKeyName.split("=")[1];

  await buildPackage({
    basePackageRootPath,
  });
};

createCliController({
  runCli,
  ...cliOptions,
  throwIfNoOptionSet: true,
  runCliFn: runCli,
});
