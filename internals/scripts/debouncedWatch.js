/*
 *
 * `debouncedWatch`: "scripts".
 *
 */
const { watch } = require("fs");
const { stat } = require("fs/promises");
const invariant = require("./invariant");
const debounce = require("./debounce");

const debouncedWatch = async ({
  fileOrDirectoryPath,
  callback,
  wait = 100,
}) => {
  invariant(
    !!fileOrDirectoryPath,
    `
    fileOrDirectoryPath must be provide given \`${fileOrDirectoryPath}\`.
  `,
  );

  await stat(fileOrDirectoryPath);

  const fsWatcher = watch(fileOrDirectoryPath);
  fsWatcher.on("change", async () => {
    if (callback) {
      const runCallback = debounce(callback, wait);
      runCallback();
    }
  });
};

module.exports = debouncedWatch;
