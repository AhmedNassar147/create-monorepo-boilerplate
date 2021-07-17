/*
 *
 * Package: `@domain/post-whatsapp-build-message`.
 *
 */
const { readFile } = require("fs/promises");
const chalk = require("chalk");
const scrapeWhatsAppBuildGroup = require("./scrapeWhatsAppBuildGroup");
const uploadZippedFile = require("./uploadZippedFile");
const zipBuildFolder = require("./zipBuildFolder");
const createMessage = require("./createMessage");
const { uploadFileAuthToken } = require("./constants");
const {
  checkIsFileExistAndGetFilePath,
  ENVIRONMENT_FILE_NAMES,
} = require("../../environment");
const {
  invariant,
  checkPathExists,
  getWorkSpaceBasePath,
} = require("../../scripts");
const getBasePaths = require("../../webpack/src/getBasePaths");

const PostWhatsAppBuildMessage = async () => {
  if (!uploadFileAuthToken) {
    console.log(
      createMessage(
        chalk.red(
          `Please go to "https://file.io" and create new account and apiKey then :
            1- create "./constants.js"
            2- define / export a variable called "uploadFileAuthToken"
            @example
            const uploadFileAuthToken = "api key";
            module.exports = {
              uploadFileAuthToken
            }
          `,
        ),
      ),
    );

    process.exit(1);
  }

  const productionEnvFilePath = checkIsFileExistAndGetFilePath(
    ENVIRONMENT_FILE_NAMES.PROD,
  );

  const variablesString = await readFile(productionEnvFilePath, {
    encoding: "utf8",
  });

  const [maybeClientNameEnvVariable] =
    variablesString.match(/CLIENT_NAME=.+/g) || [];

  const [maybeAppNameEnvVariable] =
    variablesString.match(/APP_NAME=@.+/g) || [];

  if (!(maybeAppNameEnvVariable && maybeClientNameEnvVariable)) {
    console.log(
      createMessage(
        chalk.red(
          `The ${productionEnvFilePath} should has ${chalk.white(
            '"APP_NAME=some app name" and CLIENT_NAME=some name',
          )}`,
        ),
      ),
    );

    process.exit(1);
  }

  const [APP_NAME, CLIENT_NAME] = [
    maybeAppNameEnvVariable,
    maybeClientNameEnvVariable,
  ].map(
    (fullVariableString) => fullVariableString.replace(/\s/g, "").split("=")[1],
  );

  const appDirectoryFolderPath = getWorkSpaceBasePath(APP_NAME);

  const { output: buildDirPath } = getBasePaths(appDirectoryFolderPath);

  const zippedFilePath = `${appDirectoryFolderPath}/${CLIENT_NAME}-build.zip`;

  invariant(
    await checkPathExists(buildDirPath),
    createMessage(
      chalk.bold.red(`couldn't find the ${chalk.white(buildDirPath)}`),
    ),
  );

  zipBuildFolder({
    buildDirPath,
    zippedFilePath,
    onSuccessCallBack: async () => {
      const { id, link, expires } = await uploadZippedFile(zippedFilePath);

      if (link) {
        await scrapeWhatsAppBuildGroup({
          CLIENT_NAME,
          expires,
          downloadLink: link,
          uploadedFileId: id,
        });
      }
    },
  });
};

module.exports = PostWhatsAppBuildMessage;
