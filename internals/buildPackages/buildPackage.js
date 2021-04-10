/*
 *
 * `buildPackage`: `buildPackages`.
 *
 */
"use strict";
const path = require("path");
const { writeFile, mkdir, copyFile } = require("fs/promises");
// const { exec } = require("child_process");
const getPaths = require("./getPaths");
const emitDeclarationsFile = require("./emitDeclarationsFile");
const invariant = require("../scripts/invariant");
const getAllFilesFromFolder = require("../scripts/getAllFilesFromFolder");
const createWatcher = require("../scripts/createWatcher");
const getDirNameFromPath = require("../scripts/getDirNameFromPath");
const checkPathExists = require("../scripts/checkPathExists");
const transpileFileWithBabel = require("./transpileFileWithBabel");
const { delayProcess } = require("../command-line-utils");

const buildPackage = async ({ basePackageRootPath }) => {
  invariant(
    basePackageRootPath,
    `basePackageRootPath must be provided given \`${basePackageRootPath}\`. `,
  );

  // console.info(
  //   `[buildPackage]: preparing "${basePackageRootPath}" for compilation, waiting for changes...`,
  // );

  const {
    fullPathPackageSrcPath,
    cjsBuildFolder,
    esmBuildFolder,
  } = await getPaths();

  const filesInSrcFolder = await getAllFilesFromFolder(fullPathPackageSrcPath);

  invariant(
    !!filesInSrcFolder.length,
    `can't find files to process in \`${fullPathPackageSrcPath}\`. `,
  );

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

  const getOutDirAndCreateIfNotExists = async (dirOfCurrentFile) => {
    const distFolders = [esmBuildFolder, cjsBuildFolder];
    const isFileInRootSrc = dirOfCurrentFile === "/";

    const configPromises = distFolders.map(async (distFolderPath, index) => {
      const outDirPath = isFileInRootSrc
        ? distFolderPath
        : path.join(distFolderPath, dirOfCurrentFile);

      const isDistFolderPathExist = await checkPathExists(outDirPath);

      if (!isDistFolderPathExist) {
        await mkdir(outDirPath, { recursive: true });
      }

      return {
        dir: outDirPath,
        isEsModules: !index,
      };
    });

    return await Promise.all(configPromises);
  };

  createWatcher(
    fullPathPackageSrcPath,
    async (currentChangedFile) => {
      try {
        const dirOfCurrentFile = await getDirNameFromPath(
          currentChangedFile,
          fullPathPackageSrcPath,
        );
        const isFileInRootSrc = dirOfCurrentFile === "/";

        const buildConfig = await getOutDirAndCreateIfNotExists(
          dirOfCurrentFile,
        );

        const fileExt = path.extname(currentChangedFile);
        const fileName = path.basename(currentChangedFile);

        const logFileNamePath = isFileInRootSrc
          ? `src/${fileName}`
          : `src${dirOfCurrentFile}/${fileName}`;

        const isTsTypesFiles = ["interface", "interfaces", "d"].some((ext) =>
          fileName.endsWith(`.${ext}.ts`),
        );

        const isCssFile = fileExt === ".css";
        const isJSFile = fileExt === ".js";

        if (isTsTypesFiles || isCssFile) {
          console.info(
            `skipping compilation for "${logFileNamePath}"` +
              "we just copy them to dist folders",
          );
          await Promise.all(
            buildConfig.map(async (config) => {
              return copyFile(
                currentChangedFile,
                path.join(config.dir, fileName),
              );
            }),
          );

          return;
        }

        if (!isJSFile) {
          console.info(
            `starting ts emitting declarations "${logFileNamePath}"`,
          );

          const declarations = await emitDeclarationsFile({
            fileToEmit: currentChangedFile,
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

          console.info(
            `finished ts emitting declarations "${logFileNamePath}"`,
          );
        }

        console.info(`staring babel compilation`);
        await Promise.all(
          buildConfig.map(async ({ dir, isEsModules }) => {
            try {
              const generatedCode = await transpileFileWithBabel({
                isEsModules,
                filePath: currentChangedFile,
              });

              return writeContentToFile(
                dir,
                fileName.replace(fileExt, ".js"),
                generatedCode,
              );
            } catch (error) {
              console.error(
                `Error when build the package with babel
                ${JSON.stringify(error)}
                `,
              );
            }
          }),
        );
        console.info(
          `finished compilation ["esm","cjs"] formats "${logFileNamePath}"`,
        );
        delayProcess(
          () => {
            console.clear();
            console.info(`waiting for changes..`);
          },
          undefined,
          3200,
        );
      } catch (err) {
        console.error(
          `Error after watching and emitting file \`${currentChangedFile}\`.`,
          err,
        );
      }
    },
    ["change"],
  );
};

module.exports = buildPackage;
