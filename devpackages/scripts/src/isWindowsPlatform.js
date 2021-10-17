/**
 *
 * `isWindowsPlatform`: `@domain/scripts`.
 *
 */
const isWindowsPlatform = () => ["win32", "win64"].includes(process.platform);

module.exports = isWindowsPlatform;
