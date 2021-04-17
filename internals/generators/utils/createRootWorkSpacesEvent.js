/*
 *
 * `createRootWorkSpacesEvent`: `utils`.
 *
 */

const createRootWorkSpacesEvent = (workspaceName) => ({
  type: "update-yarn-lerna-root-workspaces",
  data: {
    workspaceName,
  },
  abortOnFail: true,
});

module.exports = createRootWorkSpacesEvent;
