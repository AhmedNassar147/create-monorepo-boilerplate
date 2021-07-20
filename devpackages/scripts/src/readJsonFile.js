/*
 *
 * `readJsonFile`: `@domain/scripts`.
 *
 */
const { readFile } = require("fs/promises");

const readJsonFile = async (jsonFilePath, toJSData) => {
  const jsonFile = await readFile(jsonFilePath, {
    encoding: "utf8",
  });

  return new Promise((resolve) =>
    resolve(toJSData && jsonFile ? JSON.parse(jsonFile) : jsonFile),
  );
};

module.exports = readJsonFile;
