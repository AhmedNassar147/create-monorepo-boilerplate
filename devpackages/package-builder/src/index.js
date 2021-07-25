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
const rollupCacheBuildPlugin = require("../../rollup-build-cache-plugin");
const getBabelConfig = require("../../babel");

const createRollupConfig = async ({
  configPackageName,
  configEnvName,
  configNoCache,
}) => {
  configEnvName = configEnvName || "development";
  // const isDevelopmentEnv = configEnvName == "development";

  const babelConfig = getBabelConfig(configEnvName);

  const {
    fullPathPackageSrcPath,
    cjsBuildFolder,
    esmBuildFolder,
    absolutePackagePath,
  } = getPaths(configPackageName);

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
    external: [
      "preact/compat",
      "react-dom",
      "react",
      "styled-components",
      /babel\/runtime/,
    ],
    inlineDynamicImports: false,
    plugins: [
      rollupCacheBuildPlugin({
        configEnvName,
        absolutePackagePath,
        packageBuildDirectories: [cjsBuildFolder, esmBuildFolder],
        ignoreExistingCacheAndOverwriteIt: Boolean(configNoCache),
      }),
      alias({
        // https://preactjs.com/guide/v10/getting-started/#aliasing-react-to-preact
        entries: [
          { find: "react", replacement: "preact/compat" },
          { find: "react-dom", replacement: "preact/compat" },
        ],
      }),
      nodeResolve({
        dedupe: ["react", "react-dom", "styled-components", "preact/compat"],
        resolveOnly: [PACKAGES_MODULES_REGEX],
        // modulesOnly: true,
        extensions: [...BABEL_EXTENSIONS, ".json"],
      }),
      babelPlugin({
        configFile: false,
        babelrc: false,
        envName: configEnvName,
        exclude: ["node_modules/**"],
        // include: [/packages/, /w.+-module/],
        extensions: BABEL_EXTENSIONS,
        babelHelpers: "runtime",
        ...babelConfig,
      }),
    ].filter(Boolean),
  });
};

module.exports = createRollupConfig;
