/*
 *
 * `readJsonFileSync`: `@domain/scripts`.
 *
 */
const { readFileSync } = require("fs");

const readJsonFileSync = (jsonFilePath, toJSData) => {
  const jsonFile = readFileSync(jsonFilePath, {
    encoding: "utf8",
  });

  return toJSData ? JSON.parse(jsonFile) : jsonFile;
};

module.exports = readJsonFileSync;
