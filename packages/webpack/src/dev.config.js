/*
 *
 * Package: `@domain/webpack`.
 *
 */
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = (webpackEnv, argv) => {

  const isDevelopment = argv.mode !== 'production';
  const shouldUseSourceMap = webpackEnv.GENERATE_SOURCEMAP !== 'false';
  const publicPath = "/"


  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'source-map' : false,
    target: isDevelopment ? "web" : "browserslist",

    entry: path.join(__dirname, "src", "index.tsx"),

    output: {
      path: path.join(__dirname, "build"),
      chunkFilename: !isDevelopment
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isDevelopment && 'static/js/[name].chunk.js',
      filename: "[hash].bundle.js",
      publicPath,
    },

    devServer: {
      compress: true,
      port: process.env.PORT || 3000 || 4000 || 8080,
      contentBase: path.join(__dirname, 'build'),
      publicPath,
      stats: { colors: true },
      hot: true,
      historyApiFallback: true,
    },

    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
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
          sourceMap: shouldUseSourceMap,
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      }
    },

    module: {
      rules: [
        {
          test: /\.css$/i,
          loader: "css-loader",
          options: {
            url: true,
            import: true,
          },
        },
        {
          test: /\.ts(x?)|.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
            options: {
              sync: true
            }
          },
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      !isDevelopment && new MiniCssExtractPlugin(),
    ].filter(Boolean)
  }
};