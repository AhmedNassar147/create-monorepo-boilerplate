/*
 *
 * Package: `@domain/rollup-build-cache-plugin`.
 *
 */
const { stat } = require("fs/promises");
const path = require("path");
const chalk = require("chalk");
const calculatePackageHashsumAndCacheDirectory = require("./calculatePackageHashsumAndCacheDirectory");
const getCachedBuildDirectories = require("./getCachedBuildDirectories");
const storePackageBuildToCache = require("./storePackageBuildToCache");
const restorePackageBuildFromCache = require("./restorePackageBuildFromCache");

const rollupCacheBuildPlugin = ({
  absolutePackagePath,
  packageBuildDirectories,
  ignoreExistingCacheAndOverwriteIt,
  configEnvName,
}) => {
  let isBuildCached = false;
  let isFirstBuild = true;
  let packageHashSum;
  let packageCacheDirectory;
  let displayPackageCacheDirectory;

  return {
    name: "rollup-build-cache-plugin",
    // @see {@link https://rollupjs.org/guide/en/#options}
    async options(rollupOptions) {
      const { output } = rollupOptions;

      if (!output) {
        console.log("No output, skipping.");
        return null;
      }

      const isOutputArray = Array.isArray(output);
      const [{ dir: directoryOfFirstOutputEntry }] = isOutputArray
        ? output
        : [output];

      if (!directoryOfFirstOutputEntry || !directoryOfFirstOutputEntry.length) {
        console.log(
          chalk.red(
            `Expected \`directoryOfFirstOutputEntry\` to be truthy, check the output options.`,
          ),
        );
        process.exit(1);
      }

      const {
        packageHashSum: calcPackageHashSum,
        packageCacheDirectory: calcPackageCacheDirectory,
        displayPackageCacheDirectory: calcDisplayPackageCacheDirectory,
      } = await calculatePackageHashsumAndCacheDirectory({
        currentEnv: configEnvName,
        absolutePackagePath,
      });

      packageHashSum = calcPackageHashSum;
      packageCacheDirectory = calcPackageCacheDirectory;
      displayPackageCacheDirectory = calcDisplayPackageCacheDirectory;

      const baseNameOfBuildDirectories = packageBuildDirectories.map(
        (buildDir) => path.basename(buildDir),
      );

      const cachedBuildDirectories = await getCachedBuildDirectories({
        packageBuildDirectories: baseNameOfBuildDirectories,
        packageCacheDirectory,
      });

      const canSkipBuildIfCached =
        !ignoreExistingCacheAndOverwriteIt && isFirstBuild;

      if (canSkipBuildIfCached) {
        if (cachedBuildDirectories.length) {
          const isEveryCacheDirHasValue = cachedBuildDirectories.every(
            (cacheDire) => !!cacheDire,
          );
          if (isEveryCacheDirHasValue) {
            const baseNameOfCachedBuildDirectories = cachedBuildDirectories.map(
              (buildDir) => path.basename(buildDir),
            );

            isBuildCached = baseNameOfBuildDirectories.every((item) =>
              baseNameOfCachedBuildDirectories.includes(item),
            );
          }
        }

        if (isBuildCached) {
          return {
            ...rollupOptions,
            input: path.join(__dirname, "../src/placeholder"),
          };
        }
      }

      return rollupOptions;
    },
    async buildStart() {
      // @see {@link https://rollupjs.org/guide/en/#thismeta-rollupversion-string-watchmode-boolean}
      const { watchMode } = this.meta;

      const resolvedInputPath = path.join(absolutePackagePath, "/src");

      try {
        await stat(resolvedInputPath);
      } catch (statError) {
        throw new Error(
          `Expected the source folder to exist: \`${resolvedInputPath}\``,
        );
      }

      if (watchMode) {
        // We are in watch. We replaced the real input and all the plugins
        // with a placeholder, because we could restore from cache and save
        // time. But starting from the second build, `rollup` is incredibly
        // fast and we only store to cache, not restore from it. Unfortunately,
        // since we replaced the input chunk, we must manually add the source
        // folder to be watched and trigger the second build. From the second
        // build, we restore all the correct and original `rollup` options.
        // @see the `options` hook above.
        // Unfortunately it seems that the next line has to be executed every
        // time `buildStart` is called, when watching, or it doesn't work
        // anymore after the first rebuild.
        this.addWatchFile(resolvedInputPath);
      }
    },
    // @see {@link https://rollupjs.org/guide/en/#generatebundle}
    async generateBundle(_, bundle) {
      const rollupBundle = bundle;

      // Avoid generating an empty chunk.
      delete rollupBundle["placeholder.js"];
    },
    async writeBundle(...args) {
      const [{ dir: absolutePackageBuildDirectory }] = args;
      const { watchMode } = this.meta;

      const isFirstWatchModeBuild = watchMode && isFirstBuild;

      const shouldRestoreFromCache =
        !ignoreExistingCacheAndOverwriteIt &&
        isBuildCached &&
        (!watchMode || isFirstWatchModeBuild);

      const shouldStoreIntoCache =
        !isBuildCached ||
        ignoreExistingCacheAndOverwriteIt ||
        (watchMode && !isFirstBuild);

      if (shouldStoreIntoCache || shouldRestoreFromCache) {
        if (shouldStoreIntoCache) {
          const shouldRecalculateHashSum = watchMode && !isFirstBuild;
          if (shouldRecalculateHashSum) {
            const {
              packageHashSum: calcPackageHashSum,
              packageCacheDirectory: calcPackageCacheDirectory,
              displayPackageCacheDirectory: calcDisplayPackageCacheDirectory,
            } = await calculatePackageHashsumAndCacheDirectory({
              currentEnv: configEnvName,
              absolutePackagePath,
            });
            packageHashSum = calcPackageHashSum;
            packageCacheDirectory = calcPackageCacheDirectory;
            displayPackageCacheDirectory = calcDisplayPackageCacheDirectory;
          }
          // Copy the build into the cache.
          await storePackageBuildToCache(
            packageHashSum,
            absolutePackagePath,
            absolutePackageBuildDirectory,
            displayPackageCacheDirectory,
          );
        } else {
          // Restore the build from cache.
          await restorePackageBuildFromCache(
            packageHashSum,
            absolutePackagePath,
            absolutePackageBuildDirectory,
            displayPackageCacheDirectory,
          );
        }
      }

      isFirstBuild = false;
    },
  };
};

module.exports = rollupCacheBuildPlugin;
