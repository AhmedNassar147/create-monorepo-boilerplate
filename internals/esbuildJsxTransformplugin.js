const jsxPluginReact17 = {
  name: "jsx-react-17",
  setup(build) {
    const { readFile } = require("fs/promises");
    const babel = require("@babel/core");
    const plugin = require("@babel/plugin-transform-react-jsx").default(
      {},
      { runtime: "automatic" },
    );

    build.onLoad({ filter: /\.jsx|tsx$/ }, async (args) => {
      const jsx = await readFile(args.path, "utf8");
      const result = babel.transformSync(jsx, { plugins: [plugin] });
      return { contents: result.code };
    });
  },
};
