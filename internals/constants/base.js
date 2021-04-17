/*
 *
 * Base: `constants`.
 *
 */
const MODULES_REGEX = /\b\w+(-module)\b/gi;
const PACKAGES_REGEX = /\b(packages)\b/gi;
const PACKAGES_MODULES_REGEX = /\b\w+-module|packages\b/;
const APPS_REGEX = /\b((\w+-)?app)\b/;
const PROJECT_NAME_SPACE = "@domain";

module.exports = {
  MODULES_REGEX,
  PROJECT_NAME_SPACE,
  APPS_REGEX,
  PACKAGES_REGEX,
  PACKAGES_MODULES_REGEX,
};
