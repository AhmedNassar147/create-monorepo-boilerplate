/*
 *
 * `createWebpackBuildConfig`: `@domain/webpack`.
 *
 */
const { optimize } = require("webpack");
// const zlib = require("zlib");
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
      filename: "static/js/[name].[chunkhash].js",
      chunkFilename: "static/js/[name].[chunkhash].chunk.js",
    },
    optimization: {
      minimize: true,
      concatenateModules: true,
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
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
      // splitChunks: {
      //   chunks: "all",
      //   minSize: 0,
      //   minRemainingSize: 0,
      //   minChunks: 1,
      //   maxAsyncRequests: 30,
      //   maxInitialRequests: 30,
      //   maxSize: 244000,
      //   enforceSizeThreshold: 50000,
      //   cacheGroups: {
      //     defaultVendors: {
      //       test: /[\\/]node_modules[\\/]/,
      //       priority: -10,
      //       reuseExistingChunk: true,
      //     },
      //     json: {
      //       type: "json",
      //     },
      //     default: {
      //       minChunks: 2,
      //       priority: -20,
      //       reuseExistingChunk: true,
      //     },
      //     vendor: {
      //       test: /[\\/]node_modules[\\/]/,
      //       name(module) {
      //         const packageName = module.context.match(
      //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
      //         )[1];
      //         return `npm.${packageName.replace("@", "")}`;
      //       },
      //     },
      //   },
      // },
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 30,
        minSize: 0,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];

              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
      removeEmptyChunks: true,
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
      assetFilter: (assetFilename) =>
        !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    },
    plugins: [
      // Extracts CSS into separate files
      // Note: style-loader is for development, MiniCssExtractPlugin is for production
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "[name].[contenthash:10].css",
      }),
      // new CompressionPlugin({
      //   filename: "[path][base].br",
      //   algorithm: "brotliCompress",
      //   test: /\.(js|css|html|svg)$/,
      //   compressionOptions: {
      //     params: {
      //       [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      //     },
      //   },
      //   threshold: 10240,
      //   minRatio: 0.8,
      //   deleteOriginalAssets: false,
      // }),
      analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: `${findRootYarnWorkSpaces()}/report.html`,
        }),
    ],
  });
};

module.exports = createWebpackBuildConfig;
