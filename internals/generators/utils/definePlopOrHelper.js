/*
 *
 * `definePlopOrHelper`: `utils`.
 *
 */
const definePlopOrHelper = (plop) => {
  plop.setHelper("or", (...params) => {
    // we remove the last params because it's handlebars params
    params.splice(-1);
    return params.some((value) => !!value);
  });
};

module.exports = definePlopOrHelper;
