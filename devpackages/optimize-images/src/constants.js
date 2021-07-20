/*
 *
 * Constants: `@domain/optimize-images`.
 *
 */
const chalk = require("chalk");

const scriptName = "domain-optimize-images";

const ALLOWED_IMAGES_REGEXP = /(\.jpg)|(\.png)|(\.jpeg)/;

const allowedExtensionsString = ALLOWED_IMAGES_REGEXP.toString()
  .replace(/\/|\||\(.|\)/gi, "")
  .split(".")
  .filter(Boolean)
  .join(", ");

const cliOptions = {
  scriptName,
  throwIfNoOptionSet: true,
  description: `optimize given image/s with these types ${chalk.magenta(
    `(${allowedExtensionsString})`,
  )}`,
  helpersKeys: [
    {
      keyOrKeys: "srcPath",
      description:
        "could be an image or a folder of images. (--srcPath=assets)",
    },
    {
      keyOrKeys: "width",
      description:
        "if given, we resize the image according to it. (--width=200)",
    },
    {
      keyOrKeys: "height",
      description:
        "if given, we resize the image according to it. (--height=200)",
    },
  ],
};

module.exports = {
  cliOptions,
  scriptName,
  ALLOWED_IMAGES_REGEXP,
  allowedExtensionsString,
};
