/*
 *
 * `Constants`: `@domain/assets-helpers`.
 *
 */
module.exports = {
  validFilesRegexp: {
    ALL: /\.(js|ts|tsx|css)$/,
    ONLY_TS_OR_JS_FILES: /\.(tsx|js|ts)$/,
  },
  assetsPathsRegexp: /assets.+\.(?:ico|gif|png|jpg|jpeg|svg)/gm,
  assetsAndFirstSlashRegexp: /assets[\\/]/g,
};
