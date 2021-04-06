const path = require("path");
const getPackagePath = require("../scripts/getPackagePath");

/**
 * @see {@link https://vitejs.dev/config/}
 * @param {import('vite').ConfigEnv} envConfig
 * @return {import('vite').UserConfig}
 */
const somePath = getPackagePath("pkg1");
// const buildPackage = async () => {
//   return {
//     build: {
//       outDir: "module",
//       target: "modules",
//       minify: "terser",
//       lib: {
//         entry: path.resolve(somePath, "src/index.tsx"),
//         formats: "es",
//         name: "@domain/pkg1",
//       },
//       rollupOptions: {
//         // make sure to externalize deps that shouldn't be bundled
//         // into your library
//         external: ["react"],
//         output: {},
//       },
//     },
//   };
// };

module.exports = {
  build: {
    outDir: path.resolve(somePath, "module"),
    target: "modules",
    minify: "terser",
    lib: {
      entry: path.resolve(somePath, "src/index.tsx"),
      formats: ["es"],
      name: "@domain/pkg1",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react"],
      output: {},
    },
  },
};
