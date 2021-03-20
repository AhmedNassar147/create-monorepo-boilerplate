/*
 *
 * `createWebpackBuildConfig`: `webpack`
 *
 */
const { ids } = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const createWebpackConfig = require("./createWebpackConfig");
const getAppPathFromNodeEnv = require("../scripts/getAppPathFromNodeEnv");

const createWebpackBuildConfig = () => {
  const basePath = getAppPathFromNodeEnv();

  return createWebpackConfig({
    basePath,
    mode: "production",
    output: {
      filename: "static/js/[name].[chunkhash].js",
      chunkFilename: "static/js/[name].[chunkhash].chunk.js",
    },
    plugins: [
      // Extracts CSS into separate files
      // Note: style-loader is for development, MiniCssExtractPlugin is for production
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash].css",
        chunkFilename: "[id].css",
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
      mangleWasmImports: true,
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  });
};

module.exports = createWebpackBuildConfig;
