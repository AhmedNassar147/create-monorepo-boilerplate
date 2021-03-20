/*
 *
 * `readJsonFileAsync`: `scripts`.
 *
 */
const { readFile } = require("fs/promises");

const readJsonFileAsync = async (jsonFilePath, toJSData) => {
  const jsonFile = await readFile(jsonFilePath, {
    encoding: "utf8",
  });

  return new Promise((resolve) =>
    resolve(toJSData ? JSON.parse(jsonFile) : jsonFile),
  );
};

module.exports = readJsonFileAsync;
