/*
 *
 * `defineRemoveAtHelper`: `utils`.
 *
 */
function defineRemoveAtHelper(plop) {
  plop.setHelper("removeAt", function (value) {
    return (value || "").replace(/@/, "");
  });
}

module.exports = defineRemoveAtHelper;
