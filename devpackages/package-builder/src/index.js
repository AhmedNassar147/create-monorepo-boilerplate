/*
 *
 * Package: `@domain/package-builder`.
 *
 */
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { babel: babelPlugin } = require("@rollup/plugin-babel");
const alias = require("@rollup/plugin-alias");
const chalk = require("chalk");
const getPaths = require("./getPaths");
const { POSSIBLE_ENTRIES, BABEL_EXTENSIONS } = require("./constants");
const {
  checkPathExists,
  invariant,
  PACKAGES_MODULES_REGEX,
} = require("../../scripts");
const getBabelConfig = require("../../babel");

const createRollupConfig = async ({ configPackageName, configEnvName }) => {
  configEnvName = configEnvName || "development";

  const babelConfig = getBabelConfig(configEnvName);

  const { fullPathPackageSrcPath, cjsBuildFolder, esmBuildFolder } = getPaths(
    configPackageName,
  );

  const [inputFilePath] = (
    await Promise.all(
      POSSIBLE_ENTRIES.map((entry) =>
        checkPathExists(`${fullPathPackageSrcPath}/${entry}`),
      ),
    )
  ).filter(Boolean);

  invariant(
    !!inputFilePath,
    chalk.bold.red(
      `[createRollupConfig =]: couldn't find any of ${chalk.white(
        POSSIBLE_ENTRIES.join(" , "),
      )} in ${chalk.white(configPackageName)}`,
    ),
  );

  return Promise.resolve({
    input: inputFilePath,
    output: [
      {
        dir: esmBuildFolder,
        format: "es",
        exports: "named",
        // preserveModules: true,
      },
      {
        dir: cjsBuildFolder,
        format: "cjs",
        exports: "auto",
        // preserveModules: true,
      },
    ],
    treeshake: {
      //@see {@link https://rollupjs.org/guide/en/#treeshake}.
      moduleSideEffects: false,
    },
    // @see {@link https://rollupjs.org/guide/en/#big-list-of-options}
    watch: {
      clearScreen: false,
      exclude: "node_modules/**",
      buildDelay: 1000,
      chokidar: {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 50,
          pollInterval: 20,
        },
      },
    },
    inlineDynamicImports: false,
    plugins: [
      alias({
        entries: [
          { find: "react", replacement: "preact/compat" },
          { find: "react-dom", replacement: "preact/compat" },
        ],
      }),
      nodeResolve({
        resolveOnly: [PACKAGES_MODULES_REGEX],
        extensions: [...BABEL_EXTENSIONS, ".json"],
      }),
      babelPlugin({
        configFile: false,
        babelrc: false,
        envName: configEnvName,
        exclude: ["node_modules/**"],
        extensions: BABEL_EXTENSIONS,
        babelHelpers: "runtime",
        ...babelConfig,
      }),
    ].filter(Boolean),
  });
};

module.exports = createRollupConfig;
