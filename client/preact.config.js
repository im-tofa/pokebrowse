import { DefinePlugin } from "webpack";

export default {
  webpack(config, env, helpers, options) {
    config.node.process = "mock";
    config.plugins.push(
      new DefinePlugin({
        "process.env.OAUTH_DOMAIN": JSON.stringify("pokebrowse.eu.auth0.com"),
        "process.env.OAUTH_CLIENTID": JSON.stringify(
          "Rt7s2NMMH0PSNSobbNOMQykcK4429xr2"
        ),
        "process.env.URL": JSON.stringify("https://api.pokebrow.se/api/v1"),
      })
    );
  },
};
