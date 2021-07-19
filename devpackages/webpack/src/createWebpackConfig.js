/*
 *
 * `createWebpackConfig`: `@domain/webpack`.
 *
 */
const path = require("path");
const {
  DefinePlugin,
  /* ProvidePlugin, */
} = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const getBasePaths = require("./getBasePaths");
const BASE_WEBPACK_RESOLVE_ALIAS = require("./webpackResolveAlias");
const getBabelConfig = require("../../babel");
const { geEnvVariables } = require("../../environment");
const {
  getWorkSpaceBasePath,
  SUPPORTED_IMAGES_REGEX,
  SUPPORTED_FONTS_REGEX,
} = require("../../scripts");

const createWebpackConfig = async ({ mode, ...webpackConfig }) => {
  const { devServer, watchOptions, plugins, alias = {} } = webpackConfig;

  const {
    stringifiedVariables,
    raw: { APP_NAME },
  } = geEnvVariables({
    mode,
  });

  const basePath = getWorkSpaceBasePath(APP_NAME);

  const {
    buildDirPath,
    srcEntry,
    entrypoint,
    assetsPath,
    tsConfigPath,
    publicPath,
  } = getBasePaths(basePath);

  const isProduction = mode === "production";

  return {
    context: basePath,
    target: isProduction ? "browserslist" : "web",
    devtool: isProduction ? "source-map" : "inline-cheap-source-map",
    entry: entrypoint,
    mode,
    output: {
      path: buildDirPath,
      publicPath: "/",
      assetModuleFilename: "static/assets/[hash][ext][query]",
      // clean: true,
      // Prevents conflicts when multiple webpack runTimes (from different apps)
      // are used on the same page.
      // jsonpFunction: `webpackJsonp${appPackageJson.name}`,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      // globalObject: "this",
      ...webpackConfig.output,
    },
    ...(devServer
      ? { devServer: { ...devServer, contentBase: publicPath } }
      : {}),

    ...(watchOptions ? { watchOptions } : {}),

    resolve: {
      modules: ["app", "node_modules"],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      mainFields: ["module", "main", "browser"],
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
                // This is required for asset imports in CSS, such as url()
                publicPath: "/",
                hmr: isProduction,
              },
            },
            "css-loader",
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          // The workspaces packages/modules are built and watched by `package-builder`.
          // The `node_modules`, by convention, are expected to be shipped
          // already transpiled.
          // @see {@link https://github.com/visionmedia/debug/issues/745}
          // @see {@link https://github.com/visionmedia/debug/issues/701}
          exclude: /(node_modules\/(?!debug))|^(packages|\w.+-module)$/,
          use: [
            {
              loader: "ts-loader",
              options: { transpileOnly: true, projectReferences: true },
            },
          ],
        },
        // js|jsx: Use swc to transpile JavaScript files
        {
          test: /\.(js|jsx|tsx)$/,
          // The workspaces packages/modules are built and watched by `package-builder`.
          // The `node_modules`, by convention, are expected to be shipped
          // already transpiled.
          // @see {@link https://github.com/visionmedia/debug/issues/745}
          // @see {@link https://github.com/visionmedia/debug/issues/701}
          exclude: /(node_modules\/(?!debug))|^(packages|\w.+-module)$/,
          use: {
            loader: "babel-loader",
            options: {
              ...getBabelConfig(mode, undefined),
              /**
               * From the docs: When set, the given directory will be used
               * to cache the results of the loader. Future webpack builds
               * will attempt to read from the cache to avoid needing to run
               * the potentially expensive Babel recompilation process on each run.
               */
              cacheDirectory: true,
            },
          },
        },
        {
          test: SUPPORTED_IMAGES_REGEX,
          type: "asset/resource",
          parser: {
            dataUrlConditions: {
              maxSize: 4 * 1024,
            },
          },
        },
        { test: SUPPORTED_FONTS_REGEX, type: "asset/resource" },
      ],
    },
    // Customize the webpack build process
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: assetsPath,
            to: path.join(buildDirPath, "assets"),
            noErrorOnMissing: false,
          },
        ],
      }),
      new DefinePlugin(stringifiedVariables),

      // new ProvidePlugin({
      //   // Make `fetch` available in all the browsers.
      //   fetch: "exports-loader?self.fetch!cross-fetch",
      // }),

      new ForkTsCheckerWebpackPlugin({
        eslint: {
          enabled: true,
          files: `${srcEntry}/**/*.{ts,tsx,js,jsx}`,
          memoryLimit: 4096,
        },
        async: !isProduction,
        typescript: {
          enabled: true,
          configFile: tsConfigPath,
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
        // favicon: path.join(srcEntry, "assets/favicon.ico"),
        template: path.join(publicPath, "index.html"),
        // chunks: ["main"],
        // minify: isProduction && {
        //   removeComments: true,
        //   collapseWhitespace: true,
        //   removeRedundantAttributes: true,
        //   useShortDoctype: true,
        //   removeEmptyAttributes: true,
        //   removeStyleLinkTypeAttributes: true,
        //   keepClosingSlash: true,
        //   minifyJS: true,
        //   minifyCSS: true,
        //   minifyURLs: true,
        // },
      }),
      ...(plugins || []),
    ].filter(Boolean),
    optimization: webpackConfig.optimization || {},
    performance: webpackConfig.performance || {},
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    node: false,
  };
};

module.exports = createWebpackConfig;
