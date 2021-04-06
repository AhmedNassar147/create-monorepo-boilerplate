/*
 *
 * `createWebpackConfig`: `webpack`.
 *
 */
const path = require("path");
const { ProvidePlugin, DefinePlugin, ProgressPlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const getBasePaths = require("./getBasePaths");
const getBabelConfig = require("../babel/getBabelConfig");
const getProjectRootDirectoryPath = require("../scripts/getProjectRootDirectoryPath");
const BASE_WEBPACK_RESOLVE_ALIAS = require("../scripts/resolveAlias");
const getAppEnvVariables = require("../environment/getAppEnvVariables");

const createWebpackConfig = ({
  basePath,
  packageOrAppName,
  ...webpackConfig
}) => {
  const {
    output,
    srcEntry,
    entry,
    assetsPath,
    public,
    folderTsConfigPath,
  } = getBasePaths(basePath);
  const { devServer, watchOptions, plugins, mode, alias = {} } = webpackConfig;
  const actualMode = mode || process.env.NODE_ENV;

  const { stringifiedVariables } = getAppEnvVariables(basePath, actualMode);

  const isProduction = actualMode === "production";

  return {
    context: getProjectRootDirectoryPath(),
    target: isProduction ? "browserslist" : "web",
    devtool: isProduction ? false : "inline-cheap-source-map",
    entry,
    mode: actualMode,
    output: {
      path: output,
      publicPath: "/",
      assetModuleFilename: "static/media/[hash][ext][query]",
      ...webpackConfig.output,
    },
    ...(devServer ? { devServer } : {}),

    ...(watchOptions ? { watchOptions } : {}),

    resolve: {
      modules: ["app", "node_modules"],
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      mainFields: ["browser", "module", "main"],
      mainFiles: ["index"],
      alias: {
        ...BASE_WEBPACK_RESOLVE_ALIAS,
        ...alias,
      },
    },

    // Determine how modules within the project are treated
    module: {
      // `strictExportPresence` turns warnings like this "export 'something'
      // was not found in 'whatever'" into errors, that make the `webpack`
      // build exit with a non zero exit code (generally `2`). Sometimes these
      // wrong imports/exports only break parts of the site, but other times they
      // break it completely, resulting in our generic error page displayed to
      // the user. We prefer to catch these errors at build time, instead
      // of letting the build go forward with warnings, and then deploying a
      // broken site.
      strictExportPresence: isProduction,

      rules: [
        {
          // Preprocess our own `.css` files.
          test: /\.css$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"],
          // style-loader => {
          //   esModule: true,
          //   modules: true,
          // }

          // css-loader{
          //   loader: "css-loader",
          //   options: {
          //     sourceMap: !isProduction,
          //     esModule: true,
          //     modules: true,
          //   },
          // },
        },
        {
          // Transform third party CSS into an external stylesheet
          // `vendor.[contenthash].css`.
          test: /\.css$/,
          include: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // You can specify a `publicPath` here,
                // by default it uses `publicPath` in `webpackOptions.output`.
                // publicPath,
                hmr: isProduction,
              },
            },
            "css-loader",
          ],
        },
        // js|jsx: Use swc to transpile JavaScript files
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules\/(?!debug))|packages/,
          use: {
            loader: "babel-loader",
            options: getBabelConfig(actualMode),
          },
        },
        {
          test: /\.(ts|tsx)$/,
          // The `packages` are built and watched by `@dbh/package-builder`.
          // The `node_modules`, by convention, are expected to be shipped
          // already transpiled.
          // @see {@link https://github.com/visionmedia/debug/issues/745}
          // @see {@link https://github.com/visionmedia/debug/issues/701}
          exclude: /(node_modules\/(?!debug))|packages/,
          use: [
            {
              loader: "ts-loader",
              options: { transpileOnly: true, projectReferences: true },
            },
          ],
        },
        // Images: Copy image files to build folder
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: "asset",
          parser: {
            dataUrlConditions: {
              maxSize: 4 * 1024,
            },
          },
        },
        // Fonts and SVGs: Inline files
        { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: "asset/inline" },
      ],
    },
    // Customize the webpack build process
    plugins: [
      isProduction ? undefined : new ProgressPlugin({ percentBy: "entries" }),

      // Removes/cleans build folders and unused assets when rebuilding
      new CleanWebpackPlugin(),
      // Copies files from target to destination folder
      new CopyWebpackPlugin({
        patterns: [
          {
            from: assetsPath,
            to: path.join(output, "assets"),
            globOptions: {
              ignore: ["*.DS_Store"],
            },
            noErrorOnMissing: true,
          },
        ],
      }),

      new DefinePlugin(stringifiedVariables),

      new ProvidePlugin({
        // Make `fetch` available in all the browsers.
        fetch: "exports-loader?self.fetch!cross-fetch",
      }),

      !isProduction
        ? undefined
        : (function () {
            const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");

            return new ForkTsCheckerNotifierWebpackPlugin({
              title: "TypeScript Checking",
              excludeWarnings: false,
            });
          })(),

      new ForkTsCheckerWebpackPlugin({
        eslint: {
          enabled: true,
          files: `${srcEntry}/**/*.{ts,tsx,js,jsx}`,
          memoryLimit: 4096,
        },
        async: !isProduction,
        typescript: {
          enabled: true,
          configFile: folderTsConfigPath,
          context: basePath,
          mode: "readonly",
          typescriptPath: BASE_WEBPACK_RESOLVE_ALIAS.typescript,
        },
      }),

      // Generates an HTML file from a template
      // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
      new HtmlWebpackPlugin({
        // inject: true,
        hash: isProduction,
        title: "app title",
        // favicon: path.join(srcEntry, "assets/favicon.ico"),
        template: path.join(public, "index.html"),
        minify: isProduction && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      ...(plugins || []),
    ].filter(Boolean),
    optimization: webpackConfig.optimization || {},
    performance: webpackConfig.performance || {},
  };
};

module.exports = createWebpackConfig;