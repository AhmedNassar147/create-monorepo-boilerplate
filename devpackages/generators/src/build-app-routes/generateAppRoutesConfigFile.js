/*
 *
 * `generateAppRoutesConfigFile`: `generateAppsRoutesConfig`.
 *
 */
const { writeFileSync } = require("fs");
const { execSync } = require("child_process");
const chalk = require("chalk");
const createAppRoutesConfig = require("./createAppRoutesConfig");
const { getGeneratedRoutesFilePath } = require("../../../scripts");

const generateAppRoutesConfigFile = (appName, pagesData) => {
  const [pages, developmentPages] = createAppRoutesConfig(pagesData);

  const data = {
    pages,
  };

  if (developmentPages) {
    data.developmentPages = developmentPages;
  }

  const generatedFilePath = getGeneratedRoutesFilePath(`${appName}.json`);

  writeFileSync(generatedFilePath, JSON.stringify(data));

  execSync(`yarn prettify "${generatedFilePath}"`);
  console.log(
    chalk.magenta(
      `[generateAppsRoutesConfig => (${appName})]: finished generating routes config ✨✨`,
    ),
  );
};

module.exports = generateAppRoutesConfigFile;
