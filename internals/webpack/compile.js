/*
 *
 * `compile`: `webpack`.
 *
 */
const webpack = require("webpack");

const compile = async (config) => {
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err, new Error("Invalid webpack configuration"));
      }

      if (stats.hasErrors()) {
        reject(stats);
      }

      resolve(stats);
    });
  });
};

module.exports = compile;
