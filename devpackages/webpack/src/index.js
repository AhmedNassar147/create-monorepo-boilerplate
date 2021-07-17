/*
 *
 * Package: `@domain/webpack`.
 *
 */
const initializeWebpack = async (_, { nodeEnv, port, analyze } = {}) => {
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
