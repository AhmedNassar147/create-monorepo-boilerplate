/*
 *
 * `createMessage`: `@domain/post-whatsapp-build-message`.
 *
 */
const chalk = require("chalk");

const createMessage = (message) =>
  `${chalk.bold.cyan("[@domain/post-whatsapp-build-message]: ")} ${message}`;

module.exports = createMessage;
