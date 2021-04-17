/*
 *
 * `compileFile`: `buildPackage`.
 *
 */
"use strict";
const chalk = require("chalk");
const path = require("path");
const { writeFile, copyFile } = require("fs/promises");
// const emitDeclarationsFile = require("./emitDeclarationsFile");
const transpileFileWithBabel = require("./transpileFileWithBabel");
const getOutDirAndCreateIfNotExists = require("./getOutDirAndCreateIfNotExists");
const invariant = require("../scripts/invariant");
const getDirNameFromPath = require("../scripts/getDirNameFromPath");

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

    const isTsTypesFiles = ["interface", "interfaces", "d"].some((ext) =>
      fileName.endsWith(`.${ext}.ts`),
    );

    const isCssFile = fileExt === ".css";
    const isJsonFile = fileExt === ".json";
    // const isJSFile = fileExt === ".js";

    const buildConfig = await getOutDirAndCreateIfNotExists({
      dirOfCurrentFile,
      cjsBuildFolder,
      esmBuildFolder,
    });

    if (isTsTypesFiles || isCssFile || isJsonFile) {
      console.log(
        chalk.magenta(
          `[compileFile]: skipping babel compilation "${logFileNamePath}", ` +
            `we just copy them to ${chalk.bold.white(`module`)} folder.`,
        ),
      );
      await Promise.all(
        buildConfig.map(async (config) => {
          return copyFile(fileToCompile, path.join(config.dir, fileName));
        }),
      );

      return;
    }

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

    console.log(chalk.magenta("[compileFile]: staring babel compilation"));

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
        `[compileFile]: finished compilation ${chalk.bold.white(
          '"esm", "cjs"',
        )} formats "${logFileNamePath}"`,
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
