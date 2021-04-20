/*
 *
 * `createWebpackBuildConfig`: `webpack`
 *
 */
const { ids } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const createWebpackConfig = require("./createWebpackConfig");

process.env.NODE_ENV = "production";

const createWebpackBuildConfig = async (_, { analyze } = {}) => {
  return await createWebpackConfig({
    mode: "production",
    output: {
      filename: "static/js/[name].[chunkhash:10].js",
      // chunkFilename: specifies the name of non-entry output files (e.g. dynamic import component)
      chunkFilename: "static/js/[name].[chunkhash:10].js",
    },
    plugins: [
      // Extracts CSS into separate files
      // Note: style-loader is for development, MiniCssExtractPlugin is for production
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "[name].[contenthash:10].css",
      }),

      analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
        }),

      new ids.HashedModuleIdsPlugin({
        hashFunction: "sha256",
        hashDigest: "hex",
        hashDigestLength: 20,
      }),

      // We emit assets.
      // @see {@link https://github.com/webpack-contrib/compression-webpack-plugin#options}
      // new CompressionPlugin({
      //   filename: '[path].br[query]',
      //   algorithm: 'brotliCompress',
      //   test: testAssetsToCompress,
      //   compressionOptions: { level: 10240 },
      //   threshold: 10240,
      //   minRatio: 0.8,
      //   deleteOriginalAssets: false,
      // }),
      // new CompressionPlugin({
      //   filename: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: testAssetsToCompress,
      //   compressionOptions: { level: 1024 },
      //   threshold: 1024,
      //   minRatio: 0.8,
      //   deleteOriginalAssets: false,
      // }),
    ],
    optimization: {
      minimize: true,
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
