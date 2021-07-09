/*
 *
 * `zipBuildFolder`: `@domain/post-whatsapp-build-message`.
 *
 */
const chalk = require("chalk");
const zipLocal = require("zip-local");
const createMessage = require("./createMessage");

const logZippingError = (buildDirPath, error) => {
  console.log(
    createMessage(
      chalk.red(
        `something went wrong while zipping ${chalk.white(buildDirPath)}`,
      ),
    ),
  );

  if (error) {
    console.log(createMessage(chalk.red(`zip package message ${error}`)));
  }

  process.exit(1);
};

const zipBuildFolder = ({
  buildDirPath,
  zippedFilePath,
  onSuccessCallBack,
}) => {
  zipLocal.zip(buildDirPath, (error, zipped) => {
    if (!error) {
      zipped.compress();

      zipped.save(zippedFilePath, async function (error) {
        if (!error) {
          console.log(
            createMessage(
              chalk.magenta(
                `build zipped and save to ${chalk.white(zippedFilePath)} `,
              ),
            ),
          );

          setTimeout(async () => {
            await onSuccessCallBack();
          }, 100);

          return;
        }

        logZippingError(buildDirPath, error);
      });

      return;
    }

    logZippingError(buildDirPath, error);
  });
};

module.exports = zipBuildFolder;
