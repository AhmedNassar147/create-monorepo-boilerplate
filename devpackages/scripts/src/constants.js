/*
 *
 * Constants: `@domain/scripts`.
 *
 */
const DEV_PACKAGES_FOLDER_NAME = "devpackages";
const PACKAGES_REGEX = /^packages$/;
const NEW_PACKAGES_WORKSPACE_REGEX = /^[a-z]+packages/;

const ALL_PACKAGES_WORKSPACES_WITHOUT_DEV_ONE_STRING = `((?!.*(${DEV_PACKAGES_FOLDER_NAME}).*).)*packages$`;

const ALL_PACKAGES_WORKSPACES_WITHOUT_DEV_ONE_REGEX = new RegExp(
  `^${ALL_PACKAGES_WORKSPACES_WITHOUT_DEV_ONE_STRING}`,
);

const MODULES_REGEX = /^[a-z]+-module/;
const PACKAGES_MODULES_REGEX = new RegExp(
  `^([a-z]+-module|${ALL_PACKAGES_WORKSPACES_WITHOUT_DEV_ONE_STRING})$`,
);
const APPS_REGEX = /^([a-z|-]+)?app$/;

const PROJECT_NAME_SPACE = "@domain";

const PACKAGE_FULL_NAME_REGEXP = new RegExp(
  `^${PROJECT_NAME_SPACE}.+[/|\\].+[a-z|-]*\\w$`,
);

const PACKAGE_PATH_LIKE_REGEXP = new RegExp(
  `^([a-z]+-module|${ALL_PACKAGES_WORKSPACES_WITHOUT_DEV_ONE_STRING}).+[/|\\].+[a-z|-]*`,
  "gi",
);

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
  NEW_PACKAGES_WORKSPACE_REGEX,
  ALL_PACKAGES_WORKSPACES_WITHOUT_DEV_ONE_REGEX,
};
