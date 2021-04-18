/*
 *
 * Base: `constants`.
 *
 */
const MODULES_REGEX = /\b\w+(-module)\b/gi;
const PACKAGES_REGEX = /\b(packages)\b/gi;
const PACKAGES_MODULES_REGEX = /\b\w+-module|packages\b/;
const APPS_REGEX = /\b((\w+-)?app)\b/;

const SUPPORTED_IMAGES_REGEX = /\.(?:ico|gif|png|jpg|jpeg)$/i;
const SUPPORTED_SVGS_FONTS_REGEX = /\.(woff(2)?|eot|ttf|otf|svg|)$/;

const PROJECT_NAME_SPACE = "@domain";

module.exports = {
  MODULES_REGEX,
  PROJECT_NAME_SPACE,
  APPS_REGEX,
  PACKAGES_REGEX,
  PACKAGES_MODULES_REGEX,
  SUPPORTED_IMAGES_REGEX,
  SUPPORTED_SVGS_FONTS_REGEX,
};
