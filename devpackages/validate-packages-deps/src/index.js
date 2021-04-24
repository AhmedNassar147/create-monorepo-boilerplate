/*
 *
 * Package: `@domain/validate-packages-deps`.
 *
 */
const chalk = require("chalk");
const processPackage = require("./processPackage");
const getPackagesData = require("./getPackagesData");
const { cliOptions, scriptName } = require("./constants");
const delayProcess = require("../../../internals/scripts/delayProcess");
const {
  createCliController,
} = require("../../../internals/command-line-utils");

const runCli = async ({ filter, exitKey, logOnlyResults }) => {
  const transpiledPackagesFiles = (
    await Promise.all(getPackagesData(filter))
  ).filter(Boolean);

  const processPackagesDataLength = transpiledPackagesFiles.length;

  if (!processPackagesDataLength) {
    console.log(
      chalk.cyan(`${[scriptName]}: There are no packages to process yet.`),
    );
    process.exit(0);
  }

  let depsErrorsInPackage = [];

  while (processPackagesDataLength) {
    const selectedPackage = transpiledPackagesFiles.splice(0, 1)[0];
    if (selectedPackage) {
      const result = await delayProcess(
        processPackage,
        { ...selectedPackage, logOnlyResults },
        100,
      );
      depsErrorsInPackage.push(result);
    } else {
      break;
    }
  }

  depsErrorsInPackage = depsErrorsInPackage.filter(Boolean);
  const depsErrorsInPackageLength = depsErrorsInPackage.length;

  if (!depsErrorsInPackageLength) {
    console.log(
      chalk.bold.white(
        `[${scriptName}]: ${
          filter ? filter : "packages"
        } dependencies are fine. ✨✨`,
      ),
    );
    process.exit(0);
  }

  let shouldExit = false;

  depsErrorsInPackage.forEach(
    (
      {
        packageName,
        arePeerDependenciesChanged,
        areDependenciesChanged,
        curedPeerDependencies,
        packageFoundDependencies,
      },
      index,
    ) => {
      console.log(
        chalk.keyword("orange")(
          `[${scriptName}]: update the ${chalk.white(
            packageName,
          )} "package.json" with the following.`,
        ),
      );

      [
        [areDependenciesChanged, "dependencies", packageFoundDependencies],
        [arePeerDependenciesChanged, "peerDependencies", curedPeerDependencies],
      ].forEach(([condition, name, data]) => {
        if (condition) {
          if (name === "dependencies") {
            console.log(
              chalk.keyword("orange")(
                `[${scriptName}]: update the ${chalk.white(
                  packageName,
                )} "tsconfig.json" with these dependencies ` +
                  "relative paths.",
              ),
            );
          }
          console.log(
            chalk.red(`${name}: ====> ${JSON.stringify(data, null, 2)}`),
          );
        }
      });

      shouldExit = depsErrorsInPackageLength - 1 === index;
    },
  );

  if (shouldExit) {
    if (!logOnlyResults) {
      console.log(chalk.bold.white(`[${scriptName}]: happy hacking✨✨`));
    }
    process.exit(exitKey ? +exitKey : 0);
  }
};

createCliController({
  ...cliOptions,
  runCliFn: runCli,
});
