/*
 *
 * `invariant`: `scripts`.
 *
 */
const invariant = (condition, error) => {
  if (!condition) throw new Error(error);
};

module.exports = invariant;
