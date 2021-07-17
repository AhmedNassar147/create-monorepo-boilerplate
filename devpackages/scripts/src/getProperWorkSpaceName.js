/*
 *
 * `getProperWorkSpaceName`: `@domain/scripts`.
 *
 */
const getProperWorkSpaceName = (workspace) => workspace.replace("/*", "");

module.exports = getProperWorkSpaceName;
