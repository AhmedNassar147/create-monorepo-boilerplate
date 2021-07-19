/*
 *
 * Package: `@domain/serve-app`.
 *
 */
const path = require("path");
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const { PORT, scriptName } = require("./constants");
const logMessage = require("./logMessage");
const { collectEnvVariablesFromEnvFiles } = require("../../environment");
const { createCliController } = require("../../command-line-utils");
const {
  findRootYarnWorkSpaces,
  getPackageNameFromScopedPackage,
  checkPathExistsSync,
} = require("../../scripts");

const app = express();

const serveAppBuild = async ({ appName, port }) => {
  if (!appName) {
    const { APP_NAME } = collectEnvVariablesFromEnvFiles("production");
    appName = APP_NAME;
  }

  appName = getPackageNameFromScopedPackage(appName);

  const appPath = path.join(findRootYarnWorkSpaces(), appName);

  const appBuildPath = path.join(appPath, "build");

  if (!checkPathExistsSync(appBuildPath)) {
    logMessage(
      chalk.red(`the given app ${appName} build folder doesn't exist`),
    );

    process.exit(1);
  }

  port = port || PORT;

  logMessage(chalk.white(`starting to serve ${appBuildPath} .`));

  app.disable("x-powered-by");

  app.use(cors());

  const appAssetsPath = path.join(appBuildPath, "static", "assets");
  const appJsFilesPath = path.join(appBuildPath, "static", "js");

  app.use(express.static(appBuildPath));
  app.use(express.static(path.join(appAssetsPath)));
  app.use(express.static(path.join(appJsFilesPath)));

  app.get("*", function (_, res) {
    res.sendFile(path.join(appBuildPath, "index.html"));
  });

  // This displays message that the server running and listening to specified port
  app.listen(port, () =>
    logMessage(`see the app on ${chalk.green(`http://localhost:${port}`)}`),
  );
};

createCliController({
  scriptName,
  description: "create assets folder for given app based on routes",
  helpersKeys: [
    {
      keyOrKeys: "appName",
      description:
        "if not passed we read it from `.env files` (eg: --appName=app)",
    },
    {
      keyOrKeys: "port",
      description: `default is ${PORT}  (eg: --port=8080)`,
    },
  ],
  runCliFn: serveAppBuild,
});
