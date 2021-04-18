/*
 *
 * Constants: `@domain/package-builder`.
 *
 */
// const ts = require("typescript");

const supportedFilesExtensions = [".ts", ".tsx", ".js"];

const DEFAULT_DIST_DIR = "dist";

// const baseTsComplierOptions = {
//   module: ts.ModuleKind.ESNext,
//   target: ts.ScriptTarget.ES2015,
//   allowJs: true,
//   allowSyntheticDefaultImports: true,
//   allowUnusedLabels: false,
//   alwaysStrict: true,
//   checkJs: true,
//   declaration: true,
//   declarationMap: false,
//   emitDeclarationOnly: true,
//   declarationDir: DEFAULT_DIST_DIR,
//   downlevelIteration: true,
//   isolatedModules: true,
//   jsx: ts.JsxEmit.ReactJSX,
//   moduleResolution: ts.ModuleResolutionKind.NodeJs,
//   noEmit: false,
//   noImplicitAny: false,
//   noImplicitReturns: false,
//   noUnusedLocals: false,
//   noUnusedParameters: false,
//   sourceMap: true,
//   noImplicitUseStrict: false,
//   esModuleInterop: true,
//   skipLibCheck: true,
//   skipDefaultLibCheck: true,
//   noEmitOnError: true,
//   strict: true,
//   resolveJsonModule: true,
//   typeRoots: ["../../typings/globals", "../../typings/assets"],
//   types: ["../../typings/globals", "../../typings/assets"],
// };

const cliOptions = {
  scriptName: "build-package",
  description: "builds a package with babel to 'esm' and 'cjs' formats",
  helpersKeys: [
    {
      keyOrKeys: "packageName",
      description: "build a package by name (required)",
    },
    {
      keyOrKeys: "watch",
      description: "watch and build changed files in given package.",
    },
    {
      keyOrKeys: "force",
      description:
        "force the builder to ignore previous build and build the given package",
    },
  ],
};

module.exports = {
  // baseTsComplierOptions,
  supportedFilesExtensions,
  DEFAULT_DIST_DIR,
  cliOptions,
};
