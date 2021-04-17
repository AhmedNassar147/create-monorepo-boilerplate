/*
 *
 * `createAppDevServerConfig`: `webpack`
 *
 */
// const webpack = require("webpack");
// const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const getBasePaths = require("./getBasePaths");
const createWebpackConfig = require("./createWebpackConfig");
const getWorkSpaceBasePath = require("../workspaces/getWorkSpaceBasePath");

process.env.NODE_ENV = "development";

const createAppDevServerConfig = async (_, argv = {}) => {
  const { analyze, port } = argv;

  const basePath = getWorkSpaceBasePath(process.env.WEBPACK_APP_NAME);
  const { public } = getBasePaths(basePath);

  return await createWebpackConfig({
    basePath,
    mode: "development",
    output: {
      filename: "[name].js",
      chunkFilename: "[name].chunk.js",
      crossOriginLoading: "anonymous",
    },
    alias: {
      // Enables `ReactProfiler` when the mode is not `production`.
      // We turn on the profiler because it increases the bundle size a lot in production.
      // @see {@link https://gist.github.com/bvaughn/25e6233aeb1b4f0cdb8d8366e54a3977}
      "react-dom$": "react-dom/profiling",
      "scheduler/tracing": "scheduler/tracing-profiling",
    },
    devServer: {
      historyApiFallback: true,
      contentBase: public,
      open: true,
      compress: true,
      stats: { colors: true },
      hot: true,
      watchContentBase: true,
      port: port || 3000,
      overlay: {
        warnings: true,
        errors: true,
      },
      // overlay: { warnings: true, errors: true },
      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      clientLogLevel: "none",
      inline: true,
      // quiet: true,
    },
    watchOptions: {
      aggregateTimeout: 1100,
      poll: 5000,
      ignored: /node_modules|packages/,
    },
    plugins: [
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      new CaseSensitivePathsPlugin(),
      analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
        }),
      // new ReactRefreshWebpackPlugin({
      //   overlay: false,
      //   exclude: [/\/node_modules\/(?!frontend-lazy)\//],
      // }),
    ],
    // @see {@link https://webpack.js.org/configuration/performance/}
    performance: {
      hints: false,
      maxAssetSize: 0,
      maxEntrypointSize: 0,
    },
    // @see {@link https://webpack.js.org/configuration/optimization/}
    optimization: {
      // @see {@link https://webpack.js.org/guides/build-performance/#avoid-extra-optimization-steps}
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
      runtimeChunk: "single",
    },
  });
};

module.exports = createAppDevServerConfig;
