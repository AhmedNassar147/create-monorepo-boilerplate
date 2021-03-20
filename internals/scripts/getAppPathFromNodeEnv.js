/*
 *
 * `getAppPathFromNodeEnv`: `Scripts`
 *
 */
const getPackagePath = require("./getPackagePath");

const getAppPathFromNodeEnv = () => getPackagePath(process.env.APP_NAME);

module.exports = getAppPathFromNodeEnv;
