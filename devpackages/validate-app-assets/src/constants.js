/*
 *
 * `Constants`: `@domain/validate-app-assets`.
 *
 */
const { PROJECT_NAME_SPACE } = require("../../scripts");

module.exports = {
  scriptName: "validate-app-assets",
  POSSIBLE_MODE_OPTIONS: ["production", "development"],
  BASE_USED_PACKAGES_WITHOUT_ASSETS_IN_CURRENT_APP: [
    `${PROJECT_NAME_SPACE}/types`,
    `${PROJECT_NAME_SPACE}/base-app-wrapper`,
    `${PROJECT_NAME_SPACE}/app-with-redbox`,
    `${PROJECT_NAME_SPACE}/loader-fallback`,
    `${PROJECT_NAME_SPACE}/routes`,
    `${PROJECT_NAME_SPACE}/jsx-icons`,
    `${PROJECT_NAME_SPACE}/base-page`,
  ],
};
