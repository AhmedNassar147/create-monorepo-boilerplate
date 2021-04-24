/*
 *
 * `generateAppRoutesConfigFile`: `generateAppsRoutesConfig`.
 *
 */
const { writeFileSync } = require("fs");
const { join } = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");
const createAppRoutesConfig = require("./createAppRoutesConfig");

const generateAppRoutesConfigFile = (appName, pagesData) => {
  const [pages, developmentPages] = createAppRoutesConfig(pagesData);

  const data = {
    pages,
  };

  if (developmentPages) {
    data.developmentPages = developmentPages;
  }

  const generatedFilePath = join(__dirname, "generated", `${appName}.json`);

  writeFileSync(generatedFilePath, JSON.stringify(data));

  execSync(`yarn prettify "${generatedFilePath}"`);
  console.log(
    chalk.green(
      `[generateAppsRoutesConfig => (${appName})]: finished generating routes config ✨✨`,
    ),
  );
};

module.exports = generateAppRoutesConfigFile;
