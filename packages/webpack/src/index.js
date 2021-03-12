/*
 *
 * Package: `@domain/webpack`.
 *
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './public/index.html'), // template file
      filename:  path.resolve(__dirname, './dist/index.html')
    }),

    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
       {
         test: /\.(png|jpg|gif)$/i,
         use: [
           {
             loader: 'url-loader',
             options: {
               limit: 8192,
             }
           },
         ],
        type: 'javascript/auto'
       },
    ]
   },
};