/*
 *
 * `scrapeWhatsAppBuildGroup`: `@domain/post-whatsapp-build-message`.
 *
 */
const { writeFile, unlink } = require("fs/promises");
const { join } = require("path");
const chalk = require("chalk");
const { Client } = require("whatsapp-web.js");
const createMessage = require("./createMessage");
const { getBaseEnvVariableValues } = require("../../environment");
const { checkPathExists } = require("../../scripts");

const SESSION_FILE_PATH = join(__dirname, "session.json");

const deleteSessionFile = async () => {
  if (await checkPathExists(SESSION_FILE_PATH)) {
    await unlink(SESSION_FILE_PATH);
  }
  process.exit(1);
};

const scrapeWhatsAppBuildGroup = async ({
  CLIENT_NAME,
  expires,
  downloadLink,
  uploadedFileId,
} = {}) => {
  let sessionCfg;

  if (await checkPathExists(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
  }

  const client = new Client({
    puppeteer: { headless: false },
    session: sessionCfg,
  });

  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    console.log(
      createMessage(
        chalk.red(`QR RECEIVED =>
          ${qr}
        `),
      ),
    );
  });

  client.on("authenticated", async (session) => {
    try {
      sessionCfg = session;
      await writeFile(SESSION_FILE_PATH, JSON.stringify(session), {
        encoding: "utf8",
      });
    } catch (error) {
      console.log(
        createMessage(chalk.red(`error when writing the session to your disk`)),
      );

      process.exit(1);
    }
  });

  client.on("auth_failure", async (msg) => {
    console.log(
      createMessage(chalk.red(`error when session authentication =>` + msg)),
    );

    await deleteSessionFile();
  });

  client.on("disconnected", async (reason) => {
    console.log(
      createMessage(
        chalk.magenta(`you just logged out and the reason is: ` + reason),
      ),
    );

    await deleteSessionFile();
  });

  client.on("ready", async () => {
    try {
      const page = client.pupPage;

      await page.waitForSelector('div [id="side"] span[title="exsys-builds"]', {
        timeout: 80000,
      });

      const target = await page.$('div [id="side"] span[title="exsys-builds"]');

      await target.click();

      const messageInput = await page.$('#main [contenteditable="true"]');

      const {
        BUILD_YEAR,
        BUILD_MONTH,
        BUILD_DAY,
        BUILD_TIME,
      } = getBaseEnvVariableValues(CLIENT_NAME);

      const newDate = new Date(expires);

      const whatsAppBuildMessage =
        `✨ *${CLIENT_NAME}* NEW BUILD RELEASE @${BUILD_YEAR}-${BUILD_MONTH}-${BUILD_DAY}-${BUILD_TIME} ✨                                                                                   ` +
        `*download link :* ${downloadLink}                                                                              ` +
        `*link expires at :* ${newDate.toLocaleDateString()}                                                                                   ` +
        `*file id :* ${uploadedFileId}                                                                          `;

      await messageInput.type(whatsAppBuildMessage);
      await page.keyboard.press("Enter");

      console.log(
        createMessage(
          chalk.green(`
          *✨ whatsapp build message sent successfully ✨* \n
          *client name :* ${CLIENT_NAME} \n
          *download link :* ${downloadLink} \n
          *link expires at :* ${newDate.toLocaleDateString()}
        `),
        ),
      );

      await client.pupBrowser.close();
    } catch (error) {
      console.log(
        createMessage(
          chalk.red(
            `error when client ready and attempted to post message .` + error,
          ),
        ),
      );
      process.exit(1);
    }
  });

  try {
    await client.initialize();
  } catch (error) {
    console.log(
      createMessage(
        chalk.red(
          `maybe you closed the browser or something wrong happened when initialization.`,
        ),
      ),
    );
    process.exit(1);
  }
};

module.exports = scrapeWhatsAppBuildGroup;
