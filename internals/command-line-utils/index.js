/*
 *
 * Package: `command-line-utils`.
 *
 */
const consoleColors = require("./consoleColors");
const createHelpMessage = require("./createHelpMessage");
const createCliController = require("./createCliController");
const collectProcessOptions = require("./collectProcessOptions");
const collectProcessOptionsSync = require("./collectProcessOptionsSync");
const delayProcess = require("./delayProcess");

const sharedHelperKey = {
  keyOrKeys: ["help", "h"],
  description: `to See All options for this cli. (--help || -h)`,
};

module.exports = {
  createHelpMessage,
  consoleColors,
  createCliController,
  collectProcessOptions,
  sharedHelperKey,
  delayProcess,
  collectProcessOptionsSync,
};
