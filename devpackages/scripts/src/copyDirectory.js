/*
 *
 * `copyDirectory`: `@domain/scripts`.
 *
 */
const { readdir, mkdir, copyFile } = require("fs/promises");
const path = require("path");

const copyDirectory = async (src, dest, files) => {
  const copiedFiles = files || [];

  const entries = await readdir(src, { withFileTypes: true });

  await mkdir(dest, { recursive: true });

  const copyPromises = entries.map(async (entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    const isDirectory = entry.isDirectory();

    if (!isDirectory) {
      copiedFiles.push(destPath);
    }

    return isDirectory
      ? copyDirectory(srcPath, destPath, copiedFiles)
      : copyFile(srcPath, destPath);
  });

  await Promise.all(copyPromises);

  return copiedFiles;
};

module.exports = copyDirectory;
