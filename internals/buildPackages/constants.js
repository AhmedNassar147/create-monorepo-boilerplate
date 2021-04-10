/*
 *
 * Constants: `buildPackage`.
 *
 */
const ts = require("typescript");
const { sharedHelperKey } = require("../command-line-utils");

const supportedFilesExtensions = [".ts", ".tsx", ".js"];

const DEFAULT_DIST_DIR = "dist";

const baseTsComplierOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2015,
  allowJs: true,
  allowSyntheticDefaultImports: true,
  allowUnusedLabels: false,
  alwaysStrict: true,
  checkJs: true,
  declaration: true,
  declarationMap: false,
  emitDeclarationOnly: true,
  declarationDir: DEFAULT_DIST_DIR,
  downlevelIteration: true,
  isolatedModules: true,
  jsx: ts.JsxEmit.ReactJSX,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  noEmit: false,
  noImplicitAny: false,
  noImplicitReturns: false,
  noUnusedLocals: false,
  noUnusedParameters: false,
  sourceMap: true,
  noImplicitUseStrict: false,
  esModuleInterop: true,
  skipLibCheck: true,
  skipDefaultLibCheck: true,
  noEmitOnError: true,
  strict: true,
  typeRoots: ["../../typings/globals", "../../typings/assets"],
  types: ["../../typings/globals", "../../typings/assets"],
};

const cliOptions = {
  scriptName: "build-package",
  description:
    "watching src folder of given package to emit ts declarations and compile it with babel to 'esm' and 'cjs'.",
  helpersKeys: [
    sharedHelperKey,
    {
      keyOrKeys: "basePackageRootPath",
      description: `build a package by it's base path . (--basePackageRootPath="packages/pkg4")`,
    },
  ],
};

module.exports = {
  baseTsComplierOptions,
  supportedFilesExtensions,
  DEFAULT_DIST_DIR,
  cliOptions,
};
