/*
 *
 * Package: `@domain/prepush-linter`.
 *
 */
const { spawnSync } = require("child_process");
const chalk = require("chalk");

const prePushLinter = async () => {
  const { stdout, stderr, status } = spawnSync("git", ["branch"]);

  if (status && stderr) {
    console.log(chalk.red(stderr.toString()));
    process.exit(1);
    // process.emit("onError", stderr.toString());
    // return;
  }

  let currentBranch = stdout.toString().match(/\*\s?\w.+/);

  if (!currentBranch) {
    console.log(chalk.red("couldn't fetch current branch name"));
    process.exit(1);
  }

  currentBranch = currentBranch.toString().replace(/\*|\s/g, "");

  console.log(chalk.white(`currentBranch is  ${currentBranch} ✨✨\n`));

  process.exit(0);
};

module.exports = prePushLinter;
