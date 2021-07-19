/*
 *
 * Constants: `@domain/scripts`.
 *
 */
const MODULES_REGEX = /^\w.+-module$/;
const PACKAGES_REGEX = /^packages$/;
const PACKAGES_MODULES_REGEX = /^(\w.+-module|packages)$/;
const APPS_REGEX = /^(\w.+-)?app$/;

const PROJECT_NAME_SPACE = "@domain";

const PACKAGE_FULL_NAME_REGEXP = new RegExp(
  `^${PROJECT_NAME_SPACE}/[a-z|-]*\\w$`,
);

const PACKAGE_PATH_LIKE_REGEXP = /^(\w.+-module|packages)\/[\w|-]*/gi;

const SUPPORTED_IMAGES_REGEX = /\.(?:ico|gif|png|jpg|jpeg|svg)$/i;
const SUPPORTED_FONTS_REGEX = /\.(woff(2)?|eot|ttf|otf)$/;

module.exports = {
  MODULES_REGEX,
  PROJECT_NAME_SPACE,
  APPS_REGEX,
  PACKAGES_REGEX,
  PACKAGES_MODULES_REGEX,
  SUPPORTED_IMAGES_REGEX,
  SUPPORTED_FONTS_REGEX,
  PACKAGE_FULL_NAME_REGEXP,
  PACKAGE_PATH_LIKE_REGEXP,
};
