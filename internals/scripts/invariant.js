/*
 *
 * `invariant`: `scripts`.
 *
 */
const invariant = (condition, error, killProcess) => {
  if (!condition) {
    if (killProcess) {
      console.error(error);
      process.exit(1);
    }
    throw new Error(error);
  }
};

module.exports = invariant;
