/*
 *
 * `getUsedNodeVersion`: `@domain/scripts`.
 *
 */
const { version } = require("process");

const getUsedNodeVersion = () => version.replace(/^v*(\d+)[.].+?$/, "$1");

module.exports = getUsedNodeVersion;
