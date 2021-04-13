/*
 *
 * `afterCreationEvents`: `utils`.
 *
 */
const afterCreationEvents = ({ containingFolderPath }) => [
  {
    type: "prettify",
    data: {
      containingFolderPath,
    },
  },
  {
    type: "update-workspaces-deps",
    data: {
      containingFolderPath,
    },
  },
];

module.exports = afterCreationEvents;
