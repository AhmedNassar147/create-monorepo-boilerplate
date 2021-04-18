/*
 *
 * `compileFile`: `@domain/package-builder`.
 *
 */
"use strict";
const chalk = require("chalk");
const path = require("path");
const { writeFile, copyFile } = require("fs/promises");
const {
  SUPPORTED_IMAGES_REGEX,
  SUPPORTED_SVGS_FONTS_REGEX,
} = require("../../../internals/constants/base");
const transpileFileWithBabel = require("./transpileFileWithBabel");
const getOutDirAndCreateIfNotExists = require("./getOutDirAndCreateIfNotExists");
const invariant = require("../../../internals/scripts/invariant");
const getDirNameFromPath = require("../../../internals/scripts/getDirNameFromPath");

const writeContentToFile = async (distPath, fileName, content) => {
  const filePath = path.join(distPath, fileName);

  await writeFile(filePath, content, {
    encoding: "utf8",
  });
};

const compileFile = async ({
  fileToCompile,
  fullPathPackageSrcPath,
  cjsBuildFolder,
  esmBuildFolder,
}) => {
  try {
    invariant(
      fileToCompile,
      `fileToCompile must be provided given \`${fileToCompile}\`. `,
    );

    const dirOfCurrentFile = await getDirNameFromPath(
      fileToCompile,
      fullPathPackageSrcPath,
    );
    const isFileInRootSrc = dirOfCurrentFile === "/";

    const fileExt = path.extname(fileToCompile);
    const fileName = path.basename(fileToCompile);

    const logFileNamePath = isFileInRootSrc
      ? `src/${fileName}`
      : `src${dirOfCurrentFile}/${fileName}`;

    const nonCompilableFiles = [
      SUPPORTED_IMAGES_REGEX,
      SUPPORTED_SVGS_FONTS_REGEX,
      // `.css` | `.json` | `.d.ts` | `.interfaces.ts` | `.interface.ts`
      /\.((d|interface|interfaces)\.ts|css|json)$/gim,
    ]
      .map((regexp) => regexp.test(fileName))
      .some((isNotCompilableFile) => !!isNotCompilableFile);

    const buildConfig = await getOutDirAndCreateIfNotExists({
      dirOfCurrentFile,
      cjsBuildFolder,
      esmBuildFolder,
    });

    if (nonCompilableFiles) {
      console.log(
        chalk.cyan(
          `[compileFile]: skipping babel compilation "${chalk.bold.white(
            logFileNamePath,
          )}", ` + `we just copy them to ${chalk.bold.white(`dist`)} folder.`,
        ),
      );
      await Promise.all(
        buildConfig.map(async (config) => {
          return copyFile(fileToCompile, path.join(config.dir, fileName));
        }),
      );

      return;
    }

    console.log(
      chalk.magenta(
        `[compileFile]: staring babel compilation on ${chalk.bold.green(
          logFileNamePath,
        )}`,
      ),
    );

    await Promise.all(
      buildConfig.map(async ({ dir, isEsModules }) => {
        try {
          const generatedCode = await transpileFileWithBabel({
            isEsModules,
            filePath: fileToCompile,
          });

          return writeContentToFile(
            dir,
            fileName.replace(fileExt, ".js"),
            generatedCode,
          );
        } catch (error) {
          console.log(
            chalk.red(
              `[compileFile]: Error when build the package with babel ${JSON.stringify(
                error,
              )}`,
            ),
          );
        }
      }),
    );

    console.log(
      chalk.magenta(
        `[compileFile]: finished ${chalk.bold.green(
          logFileNamePath,
        )} compilation for ${chalk.bold.white('"esm", "cjs"')} formats.`,
      ),
    );
  } catch (error) {
    console.log(
      chalk.red(
        `[compileFile]: Error when compiling \`${fileToCompile}\``,
        `${JSON.stringify(error)}.`,
      ),
    );
  }
};

module.exports = compileFile;

// if (!isJSFile) {
//   console.log(
//     chalk.magenta(
//       `[compileFile]: typescript emitting declarations started "${logFileNamePath}"`,
//     ),
//   );

// const declarations = await emitDeclarationsFile({
//   fileToEmit: fileToCompile,
// });

//   invariant(declarations, "Expected declarations to be generated.");

//   await Promise.all(
//     buildConfig.map(async (config) => {
//       return writeContentToFile(
//         config.dir,
//         fileName.replace(fileExt, ".d.ts"),
//         declarations,
//       );
//     }),
//   );

//   console.log(
//     chalk.magenta(
//       `[compileFile]: finished ts emitting declarations "${logFileNamePath}"`,
//     ),
//   );
// }
