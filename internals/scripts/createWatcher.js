/*
 *
 * `createWatcher`: `scripts`
 *
 */
const chokidar = require("chokidar");

const options = {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 30,
    pollInterval: 10,
  },
};

const createWatcher = (folderOrFilesPaths, onFileChanged, actions) => {
  const watcherActions = (watcher) => {
    (actions || ["all"]).forEach(function (type) {
      watcher.on(type, (...args) => onFileChanged(type, ...args));
    });
  };

  if (typeof folderOrFilesPaths === "string") {
    const watcher = chokidar.watch(folderOrFilesPaths, options);

    watcherActions(watcher);
    return;
  }

  folderOrFilesPaths.forEach((fileName) => {
    const watcher = chokidar.watch(fileName, options);
    watcherActions(watcher);
  });
};

module.exports = createWatcher;
