/*
 *
 * `getStagedFiles`: `@domain/precommit-linter`
 *
 */
const { spawnSync } = require("child_process");
const { ignoredFilesRegexp } = require("./constants");

const getStagedFiles = () => {
  const { stdout, stderr, status } = spawnSync("git", [
    "diff",
    "--relative",
    "--name-only",
    /*
    Diff filters :
      Added (A),
      Copied (C),
      Deleted (D),
      Modified (M),
      Renamed (R),
      changed (T),
      Unmerged (U),
      Unknown (X),
      Broken (B)
      https://git-scm.com/docs/git-diff#git-diff---diff-filterACDMRTUXB82308203
  */
    "--diff-filter=ACMRTUXB",
    "--cached",
  ]);

  if (status) {
    process.emit("onError", stderr.toString());
    return;
  }

  let files = stdout.toString().split("\n").filter(Boolean);

  if (files.length) {
    files = files.filter((file) => !ignoredFilesRegexp.test(file));
  }

  return files;
};

module.exports = getStagedFiles;
