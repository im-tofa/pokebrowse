import { DefinePlugin } from "webpack";

export default {
  webpack(config, env, helpers, options) {
    config.node.process = "mock";
    config.plugins.push(
      new DefinePlugin({
        "process.env.LOGIN_URL": JSON.stringify("http://localhost:8080"),
        "process.env.URL": JSON.stringify("http://localhost:8080/api"),
      })
    );
  },
};
