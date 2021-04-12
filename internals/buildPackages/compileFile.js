/*
 *
 * `compileFile`: `buildPackages`.
 *
 */
"use strict";
const path = require("path");
const { writeFile, copyFile } = require("fs/promises");
const emitDeclarationsFile = require("./emitDeclarationsFile");
const transpileFileWithBabel = require("./transpileFileWithBabel");
const getOutDirAndCreateIfNotExists = require("./getOutDirAndCreateIfNotExists");
const invariant = require("../scripts/invariant");
const getDirNameFromPath = require("../scripts/getDirNameFromPath");
// const { exec } = require("child_process");

const writeContentToFile = async (distPath, fileName, content) => {
  const filePath = path.join(distPath, fileName);

  await writeFile(filePath, content, {
    encoding: "utf8",
  });

  // try {
  //   exec(`yarn prettify ${filePath}`);
  // } catch (error) {
  //   console.error("error", error);
  // }
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
    const isJSFile = fileExt === ".js";

    const buildConfig = await getOutDirAndCreateIfNotExists({
      dirOfCurrentFile,
      cjsBuildFolder,
      esmBuildFolder,
    });

    if (isTsTypesFiles || isCssFile) {
      console.info(
        `skipping babel compilation and ts emitting for "${logFileNamePath}", ` +
          "we just copy them to `module` and `dist` folders.",
      );
      await Promise.all(
        buildConfig.map(async (config) => {
          return copyFile(fileToCompile, path.join(config.dir, fileName));
        }),
      );

      return;
    }

    if (!isJSFile) {
      console.info(`starting ts emitting declarations "${logFileNamePath}"`);

      const declarations = await emitDeclarationsFile({
        fileToEmit: fileToCompile,
      });

      invariant(declarations, "Expected declarations to be generated.");

      await Promise.all(
        buildConfig.map(async (config) => {
          return writeContentToFile(
            config.dir,
            fileName.replace(fileExt, ".d.ts"),
            declarations,
          );
        }),
      );

      console.info(`finished ts emitting declarations "${logFileNamePath}"`);
    }

    console.info(`staring babel compilation`);

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
          console.error(
            `Error when build the package with babel ${JSON.stringify(error)}`,
          );
        }
      }),
    );

    console.info(
      `finished compilation ["esm","cjs"] formats "${logFileNamePath}"`,
    );
  } catch (error) {
    console.error(
      `something went wrong when compiling \`${fileToCompile}\`.`,
      err,
    );
  }
};

module.exports = compileFile;
