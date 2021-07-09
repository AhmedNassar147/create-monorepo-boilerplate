/*
 *
 * `uploadZippedFile`: `@domain/post-whatsapp-build-message`.
 *
 */
const { createReadStream } = require("fs");
const { unlink } = require("fs/promises");
const chalk = require("chalk");
const FormData = require("form-data");
const fetch = require("node-fetch");
const createMessage = require("./createMessage");
const { uploadFileAuthToken } = require("./constants");

const uploadZippedFile = async (zippedFilePath) => {
  const formData = new FormData();
  formData.append("maxDownloads", 1);
  formData.append("autoDelete", "true");
  formData.append(
    "file",
    createReadStream(zippedFilePath, {
      encoding: "binary",
    }),
  );

  const fetchOptions = {
    method: "POST",
    body: formData,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${uploadFileAuthToken}`,
    },
  };

  let requestResponse = {};

  try {
    console.log(createMessage(chalk.cyan(`uploading ${zippedFilePath} ...`)));

    const response = await fetch("https://file.io", fetchOptions);
    const { success, message, ...rest } = await response.json();

    if (!success) {
      console.log(createMessage(chalk.red(message)));
      process.exit(1);
    }

    const { id, name, link, expires } = rest;
    requestResponse = {
      id,
      name,
      link,
      expires,
    };
    await unlink(zippedFilePath);
  } catch (error) {
    console.log("ERROR =>", error);
    console.log(
      createMessage(chalk.red("error when uploading the build file")),
    );

    process.exit(1);
  }

  return requestResponse;
};

module.exports = uploadZippedFile;
