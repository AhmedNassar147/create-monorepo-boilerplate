/*
 *
 * `getProperWorkSpaceName`:`scripts`.
 *
 */
const getProperWorkSpaceName = (workspace) => workspace.replace("/*", "");

module.exports = getProperWorkSpaceName;
