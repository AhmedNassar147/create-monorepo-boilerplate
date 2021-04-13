/*
 *
 * Base: `constants`.
 *
 */
const MODULES_REGEX = /.+\b(-module)\b/gi;
const APPS_REGEX = /(.+)?\b(-?app)\b/gi;
const PROJECT_NAME_SPACE = "@domain";

module.exports = {
  MODULES_REGEX,
  PROJECT_NAME_SPACE,
  APPS_REGEX,
};
