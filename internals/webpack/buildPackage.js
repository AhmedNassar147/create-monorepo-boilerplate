/*
 *
 * `buildPackage`: `webpack`
 *
 */
const fs = require("fs");
const path = require("path");
const compile = require("./compile");
const getPackagePath = require("../scripts/getPackagePath");

process.env.NODE_ENV = "production";

const packages = process.argv.slice(2) || [];

const throwError = (error) => {
  process.stdout.write(`${error}\n`);
  process.stdout.write(`yarn build script usage: "yarn build @scope/name"\n`);
  process.exit(1);
};

if (packages.length === 0) {
  throwError(`Packages to build are not defined`);
}

const paths = [];

packages.forEach((packageName) => {
  const packagePath = getPackagePath(packageName);
  const packageEntryPath = path.join(packagePath, "src/index");

  if (!fs.existsSync(packageEntryPath)) {
    process.stdout.write(
      `Warning: cannot locate package: ${packageName}, skipping`,
    );
  } else {
    paths.push({ packagePath, packageName });
  }
});

if (paths.length === 0) {
  throwError(`Packages to build cannot be located`);
}

process.stdout.write(
  `Building packages ${paths.map((p) => p.name).join(", ")}\n`,
);

Promise.all(
  paths.map(({ packagePath, packageName }) => {
    return compile({ packagePath, packageName })
      .then((stats) => {
        process.stdout.write(
          `✔ Package ${packageName} was built in ${(stats.toJson().time / 1000)
            .toFixed(2)
            .toString()}s\n`,
        );
      })
      .catch((err, stats) => {
        if (err) {
          process.stdout.write(`✗ Package ${packageName} build crashed:\n`);
          process.stdout.write(`${err}\n`);
        }

        process.stdout.write(`✗ Package ${packageName} build crashed:\n`);
        process.stdout.write(`${stats.toString("minimal")}\n`);
        process.exit(1);
      });
  }),
).then(() => {
  process.exit(0);
});
