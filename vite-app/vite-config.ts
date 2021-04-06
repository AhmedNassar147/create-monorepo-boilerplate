import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import BASE_VITE_RESOLVE_ALIAS from "../internals/scripts/resolveAlias";
import getAppEnvVariables from "../internals/environment/getAppEnvVariables";

// @see {@link https://vitejs.dev/config/}
const createViteConfig = ({ mode }) => {
  const { stringifiedVariables } = getAppEnvVariables(process.cwd(), mode);

  return defineConfig({
    mode: mode || "development",
    resolve: {
      alias: BASE_VITE_RESOLVE_ALIAS,
      mainFields: ["main", "module", "jsnext:main", "jsnext", "browser"],
      // conditions: {
      //   "*": {
      //     import: "./index.esm.js",
      //     require: "./index.cjs.js",
      //   },
      // },
      // are the default extensions
      // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    define: stringifiedVariables,
    plugins: [reactRefresh()],
  });
};

module.exports = createViteConfig;
