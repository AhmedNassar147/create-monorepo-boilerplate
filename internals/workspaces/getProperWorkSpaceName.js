/*
 *
 * `getProperWorkSpaceName`:`workspaces`.
 *
 */
const getProperWorkSpaceName = (workspace) => workspace.replace("/*", "");

module.exports = getProperWorkSpaceName;
