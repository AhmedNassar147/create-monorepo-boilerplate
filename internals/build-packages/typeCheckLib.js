/*
 *
 * `typeCheckLib`: `build-packages`.
 *
 */
const typescript = require("typescript");
const fs = require("fs");
// const TscWatchClient = require("tsc-watch/client");
// const watch = new TscWatchClient();

function watch(directoryPath, options) {
  const rootFileNames = fs
    .readdirSync(`${directoryPath}/src`)
    .filter(
      (fileName) =>
        fileName.length >= 3 &&
        fileName.substr(fileName.length - 3, 3) === ".ts",
    );

  const files = {};

  // initialize the list of files
  rootFileNames.forEach((fileName) => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: (fileName) =>
      files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return typescript.ScriptSnapshot.fromString(
        fs.readFileSync(fileName).toString(),
      );
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) =>
      typescript.getDefaultLibFilePath(options),
    fileExists: typescript.sys.fileExists,
    readFile: typescript.sys.readFile,
    readDirectory: typescript.sys.readDirectory,
    directoryExists: typescript.sys.directoryExists,
    getDirectories: typescript.sys.getDirectories,
  };

  // Create the language service files
  const services = typescript.createLanguageService(
    servicesHost,
    typescript.createDocumentRegistry(),
  );

  // Now let's watch the files
  rootFileNames.forEach((fileName) => {
    // First time around, emit all files
    emitFile(fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(
      fileName,
      { persistent: true, interval: 250 },
      (curr, prev) => {
        // Check timestamp
        if (+curr.mtime <= +prev.mtime) {
          return;
        }

        // Update the version to signal a change in the file
        files[fileName].version++;

        // write the changes to disk
        emitFile(fileName);
      },
    );
  });

  function emitFile(fileName) {
    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach((o) => {
      fs.writeFileSync(o.name, o.text, "utf8");
    });
  }

  function logErrors(fileName) {
    let allDiagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach((diagnostic) => {
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n",
      );
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start,
        );
        console.log(
          `  Error ${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`,
        );
      } else {
        console.log(`  Error: ${message}`);
      }
    });
  }
}

// Start the watcher
watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS });

// const typeCheckLib = (directoryPath) => {
//   try {
//     watch.on("success", () => {
//       console.log("success", directoryPath);
//     });

//     watch.on("compile_errors", () => {
//       console.log("compile_errors", directoryPath);
//     });
//     // --include=./src/* --emitDeclarationOnly target=es5 --allowJs --checkJs --jsx=react-jsx --declarationDir=types

//     watch.start(`tsc`, `${directoryPath}/tsconfig.json`);
//     // do something...
//   } catch (e) {
//     watch.kill(); // Fatal error, kill the compiler instance.
//   }
// };

// module.exports = typeCheckLib;
