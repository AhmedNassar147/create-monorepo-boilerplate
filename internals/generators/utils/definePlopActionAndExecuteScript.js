/*
 *
 * `definePlopActionAndExecuteScript`: `utils`.
 *
 */
const { execSync } = require("child_process");

function definePlopActionAndExecuteScript(plop, actionName, createCommands) {
  plop.setActionType(actionName, (answers, config) => {
    try {
      if (createCommands) {
        let commands = createCommands(answers, config);

        if (commands && commands.length > 0) {
          commands = Array.isArray(commands) ? commands : [commands];

          commands.forEach((command) => {
            execSync(command);
          });
        }
      }
    } catch (err) {
      throw err;
    }
  });
}

module.exports = definePlopActionAndExecuteScript;
