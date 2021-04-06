// /**
//  * @see {@link https://vitejs.dev/config/}
//  * @param {import('vite').ConfigEnv} envConfig
//  * @return {import('vite').UserConfig}
//  */

/**
 * @see {@link https://vitejs.dev/config/}
 * @type {import('vite').UserConfig}
 */
module.exports = {
  root: process.env.PACKAGE_BUILDER_ROOT,
  build: {
    outDir: "module",
    target: "modules",
    minify: "terser",
    lib: {
      entry: "src/index",
      name: process.env.PACKAGE_BUILDER_LIB_NAME,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react"],
      output: {
        inlineDynamicImports: false,
      },
    },
  },
};
