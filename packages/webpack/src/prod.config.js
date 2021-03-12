/*
 *
 * Package: `@domain/webpack`.
 *
 */
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (webpackEnv) => {

  const isDevelopment = webpackEnv.NODE_ENV !== 'production';
  const shouldUseSourceMap = webpackEnv.GENERATE_SOURCEMAP !== 'false';




  return {
    mode: 'production',
    devtool: false,

    entry: path.join(__dirname, "src", "index.tsx"),

    output: {
      path: path.join(__dirname, "build"),
      filename: "[name].bundle.js"
    },

    devServer: {
      contentBase: path.join(__dirname, 'build'),
      compress: true,

    },


    optimization: {
      minimize: true,
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
            keep_classnames: isEnvProductionProfile,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: false,
        }),
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
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "app title",
        filename: 'index.html',
        template: path.join(__dirname, 'public/index.html')
      }),
    ].filter(Boolean)
  }
};