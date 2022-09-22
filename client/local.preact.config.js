import { DefinePlugin } from "webpack";

export default {
  webpack(config, env, helpers, options) {
    config.node.process = "mock";
    config.plugins.push(
      new DefinePlugin({
        "process.env.OAUTH_DOMAIN": JSON.stringify("dev-gnh7bcs1.eu.auth0.com"),
        "process.env.OAUTH_CLIENTID": JSON.stringify(
          "XfhFHObJfac7bUPLdK58zqaZGxsY4N3O"
        ),
        "process.env.URL": JSON.stringify("http://localhost:8080/api/v1"),
      })
    );
  },
};
