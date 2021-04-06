/*
 *
 * `throwIfCurrentRootIsNotExist`: "scripts".
 *
 */
const invariant = require("./invariant");
const getWorksSpacesWithoutOnlyNames = require("./getWorksSpacesWithoutOnlyNames");

const throwIfCurrentRootIsNotExist = (workSpaceRootFolderName, killProcess) => {
  invariant(
    !!workSpaceRootFolderName,
    `root must be set given \`${workSpaceRootFolderName}\`.`,
    killProcess,
  );

  const workSpaces = getWorksSpacesWithoutOnlyNames();

  const hasCurrentLibDir = workSpaces.some(
    (workSpace) => workSpace === workSpaceRootFolderName,
  );

  invariant(
    hasCurrentLibDir,
    "looks like you provided a wrong workspace name or " +
      'you didn\'t set it in the "workSpaces" property in ' +
      `root package.json given \`${workSpaceRootFolderName}\` ` +
      `current specified workSpaces are ${workSpaces.join()} . `,
  );
};

module.exports = throwIfCurrentRootIsNotExist;
