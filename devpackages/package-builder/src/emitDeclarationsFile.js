// /*
//  *
//  * emitDeclarationsFile: `buildPackage`.
//  *
//  */
// const chalk = require("chalk");
// const ts = require("typescript");
// const { baseTsComplierOptions, DEFAULT_DIST_DIR } = require("./constants");
// const invariant = require("../scripts/invariant");
// const checkPathExists = require("../scripts/checkPathExists");

// const emitDeclarationsFile = async ({
//   declarationDir = DEFAULT_DIST_DIR,
//   fileToEmit,
// }) => {
//   invariant(fileToEmit, `Expected file to be emitted given \`${fileToEmit}\`.`);

//   const isFileExist = await checkPathExists(fileToEmit);

//   invariant(isFileExist, `couldn't find the given file \`${fileToEmit}\`.`);

//   const options = {
//     ...baseTsComplierOptions,
//     declarationDir,
//   };

//   let declarationCode = "";

//   // Create a Program with an in-memory emit
//   const host = ts.createCompilerHost(options);
//   host.writeFile = (_, contents) => (declarationCode = contents);

//   const fileNames = [fileToEmit];

//   // Prepare and emit the d.ts files
//   const program = ts.createProgram(fileNames, options, host);
//   const { diagnostics, emitSkipped } = program.emit();

//   let hasErrors = false;

//   if (diagnostics.length) {
//     diagnostics.forEach((diagnostic) => {
//       let message = ts.flattenDiagnosticMessageText(
//         diagnostic.messageText,
//         "\n",
//       );
//       if (diagnostic.file) {
//         let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
//           diagnostic.start,
//         );
//         hasErrors = true;
//         console.log(
//           chalk.red(
//             `Error ${diagnostic.file.fileName} (${line + 1},${
//               character + 1
//             }): ${message}`,
//           ),
//         );
//       } else {
//         hasErrors = true;
//         console.log(chalk.red(`Error: ${message}`));
//       }
//     });
//   }

//   invariant(!hasErrors || emitSkipped, `Declaration process exiting.`);

//   const declarations = declarationCode
//     .replace(/import.+(.css).+/gm, "")
//     .replace(/^\s*[\r\n]/gm, "");

//   return new Promise((resolve) => resolve(declarations));
// };

// module.exports = emitDeclarationsFile;
