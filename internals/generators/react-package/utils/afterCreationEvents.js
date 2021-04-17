/*
 *
 * `afterCreationEvents`: `utils`.
 *
 */
const createRootWorkSpacesEvent = require("../../utils/createRootWorkSpacesEvent");

const afterCreationEvents = ({
  containingFolderPath,
  updateWorkSpacesRoots,
  workspaceName,
  folderOrFileName,
}) => [
  {
    type: "prettify",
    data: {
      containingFolderPath,
      folderOrFileName,
    },
  },
  ...(updateWorkSpacesRoots ? [createRootWorkSpacesEvent(workspaceName)] : []),
  {
    type: "update-workspaces-deps",
    data: {
      containingFolderPath,
      folderOrFileName,
    },
  },
];

module.exports = afterCreationEvents;
