/*
 *
 * `getAllFilesFromFolder`: `@domain/validate-packages-deps`.
 *
 */
const { join } = require("path");
const { readdir, stat } = require("fs/promises");
const { ignoredPathsRegex } = require("./constants");

const getAllFilesFromFolder = async (folderPath) => {
  let files = await readdir(folderPath);

  files = await Promise.all(
    files.map(async (file) => {
      const filePath = join(folderPath, file);
      const stats = await stat(filePath);

      return stats.isDirectory() ? getAllFilesFromFolder(filePath) : filePath;
    }),
  );

  return new Promise((resolve) => {
    resolve(
      files.reduce(
        (all, folderContents) =>
          all
            .concat(folderContents)
            .filter((filePath) => {
              const isAcceptableFilePathLength = filePath.length >= 3;

              if (!isAcceptableFilePathLength) {
                return false;
              }

              return !ignoredPathsRegex.test(filePath);
            })
            .filter(Boolean),
        [],
      ),
    );
  });
};

module.exports = getAllFilesFromFolder;
