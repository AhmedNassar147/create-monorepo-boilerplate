/*
 *
 * `updateJsonFileSync`: `@domain/scripts`.
 *
 */
const { writeFileSync } = require("fs");
const { execSync } = require("child_process");
const readJsonFileSync = require("./readJsonFileSync");
const checkPathExistsSync = require("./checkPathExistsSync");
const invariant = require("./invariant");

const updateJsonFileSync = (jsonFilePath, updater, shouldPrettifyFile) => {
  invariant(
    checkPathExistsSync(jsonFilePath),
    `\`(updateJsonFile)\`: "jsonFilePath" doesn't exist yet given "${jsonFilePath}".`,
  );

  invariant(
    typeof updater === "function",
    `\`(updateJsonFile)\`: "updater" must be function given "${typeof updater}".`,
  );

  const fileData = readJsonFileSync(jsonFilePath, true);

  const updatedData = updater(fileData);

  invariant(
    typeof updatedData === "object",
    `\`(updateJsonFile)\`: "updater" must be return new js object given "${typeof updatedData}".`,
  );

  writeFileSync(jsonFilePath, JSON.stringify(updatedData));

  if (shouldPrettifyFile) {
    execSync(`yarn prettify "${jsonFilePath}"`);
  }
};

module.exports = updateJsonFileSync;
