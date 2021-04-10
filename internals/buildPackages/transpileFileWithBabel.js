/*
 *
 * transpileFileWithBabel: `buildPackages`.
 *
 */
"use strict";
const babel = require("@babel/core");
const getBabelConfig = require("../babel/getBabelConfig");

const transpileFileWithBabel = async ({ filePath, isEsModules }) => {
  const config = await getBabelConfig("packagesBuildEnv", !isEsModules);

  return new Promise((resolve, reject) => {
    babel.transformFile(filePath, config, (err, result) => {
      if (err) {
        console.log("err", err);
        return reject({
          err,
          filePath,
          whenUsingEsm: isEsModules,
        });
      } else resolve(result.code);
    });
  });
};

module.exports = transpileFileWithBabel;
