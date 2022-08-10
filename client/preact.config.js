import { DefinePlugin } from "webpack";

export default {
  webpack(config, env, helpers, options) {
    config.node.process = "mock";
    config.plugins.push(
       new DefinePlugin({
         "process.env.PROD_LOGIN_URL": JSON.stringify(
           "https://www.pokebrow.se/auth"
         ),
         "process.env.PROD_URL": JSON.stringify("https://www.pokebrow.se/api"),
       })
     );
  },
};
