/*
 *
 * Package: `@domain/webpack`.
 *
 */
const initializeWebpack = async (_, { nodeEnv, port, analyze } = {}) => {
  // console.log({
  //   cwd: process.cwd(),
  //   dir: __dirname,
  // });

  const createWebpackConfigFn =
    nodeEnv === "development"
      ? require("./createAppDevServerConfig")
      : require("./createWebpackBuildConfig");

  const params = {
    port,
    analyze,
  };

  return await createWebpackConfigFn(params);
};

module.exports = initializeWebpack;
