/*
 *
 * `createWebpackBuildConfig`: `@domain/webpack`.
 *
 */
const { ids, optimize } = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const createWebpackConfig = require("./createWebpackConfig");
const { findRootYarnWorkSpaces } = require("../../scripts");

process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

const createWebpackBuildConfig = async ({ analyze } = {}) => {
  return await createWebpackConfig({
    mode: "production",
    output: {
      filename: "static/js/[name].js",
      // chunkFilename: specifies the name of non-entry output files (e.g. dynamic import component)
      chunkFilename: "static/js/[name].chunk.js",
    },
    plugins: [
      // Extracts CSS into separate files
      // Note: style-loader is for development, MiniCssExtractPlugin is for production
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "[name].[contenthash:10].css",
      }),
      new ids.HashedModuleIdsPlugin({
        hashFunction: "sha256",
        hashDigest: "hex",
        hashDigestLength: 20,
      }),
      analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: `${findRootYarnWorkSpaces()}/report.html`,
        }),
    ],
    optimization: {
      minimize: true,
      concatenateModules: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: true,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
        new optimize.SplitChunksPlugin(),
        new UglifyJsPlugin(),
      ],
      // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
      // instead of having their own. This also helps with long-term caching, since the chunks will only
      // change when actual code changes, not the webpack runtime.
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
      splitChunks: {
        chunks: "all",
        name: false,
      },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  });
};

module.exports = createWebpackBuildConfig;
