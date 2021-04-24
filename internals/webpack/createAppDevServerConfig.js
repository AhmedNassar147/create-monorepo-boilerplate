/*
 *
 * `createAppDevServerConfig`: `webpack`
 *
 */
const { HotModuleReplacementPlugin } = require("webpack");
// const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const createWebpackConfig = require("./createWebpackConfig");

process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

const createAppDevServerConfig = async (_, { analyze, port } = {}) => {
  return await createWebpackConfig({
    mode: "development",
    output: {
      filename: "[name].[hash:10].js",
      chunkFilename: "[name].[hash:10].js",
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
      open: true,
      compress: true,
      stats: { colors: true },
      hot: true,
      watchContentBase: true,
      port: port || 3000,
      overlay: { warnings: true, errors: true },
      clientLogLevel: "none",
      inline: true,
      // quiet: true,
    },
    watchOptions: {
      aggregateTimeout: 1100,
      poll: 5000,
      ignored: /(node_modules\/(?!debug))|^(packages|\w.+-module)$/,
    },
    plugins: [
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      new CaseSensitivePathsPlugin(),
      analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
        }),
      new HotModuleReplacementPlugin(),
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
