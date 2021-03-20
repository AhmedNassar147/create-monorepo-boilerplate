/*
 *
 * `readJsonFileSync`: `scripts`.
 *
 */
const fs = require("fs");

const readJsonFileSync = (jsonFilePath, toJSData) => {
  const jsonFile = fs.readFileSync(jsonFilePath, {
    encoding: "utf8",
  });

  return toJSData ? JSON.parse(jsonFile) : jsonFile;
};

module.exports = readJsonFileSync;
