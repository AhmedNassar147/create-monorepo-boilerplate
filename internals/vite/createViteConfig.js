const { defineConfig } = require("vite");
const reactRefresh = require("@vitejs/plugin-react-refresh");
const BASE_VITE_RESOLVE_ALIAS = require("../scripts/resolveAlias");
const getAppEnvVariables = require("../environment/getAppEnvVariables");
const getAppPathFromNodeEnv = require("../scripts/getAppPathFromNodeEnv");

/**
 * @see {@link https://vitejs.dev/config/}
 * @param {import('vite').ConfigEnv} envConfig
 * @return {import('vite').UserConfig}
 */
const createViteConfig = ({ mode }) => {
  const currentAppPath = getAppPathFromNodeEnv();

  console.log("currentAppPath", currentAppPath);
  const { stringifiedVariables } = getAppEnvVariables(currentAppPath, mode);

  return defineConfig({
    root: currentAppPath,
    mode: mode || "development",
    resolve: {
      alias: BASE_VITE_RESOLVE_ALIAS,
      mainFields: ["main", "module", "jsnext:main", "jsnext", "browser"],
      conditions: {
        "*": {
          import: "./index.esm.js",
          require: "./index.cjs.js",
        },
      },
      // are the default extensions
      // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    define: stringifiedVariables,
    plugins: [reactRefresh()],
  });
};

module.exports = createViteConfig;
