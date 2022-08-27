import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Route, Router } from "preact-router";

import Profile from "../routes/profile";
import SetBrowser from "../routes/browser";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import style from "./style.css";
import Uploader from "../routes/upload";
import { Auth0Provider } from "@auth0/auth0-react";
import Redirect from "../routes/redirect";

const App: FunctionalComponent = () => {
  const [authenticated, setAuthenticated] = useState<
    boolean | null | undefined
  >(undefined);

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) return <div id="preact_root" class={style.preact_root}></div>;

  return (
    <Auth0Provider
      domain={process.env.OAUTH_DOMAIN}
      clientId={process.env.OAUTH_CLIENTID}
      redirectUri={origin + "/callback"}
      audience={"https://api.pokebrow.se"}
      scope="openid">
      <div id="preact_root" class={style.preact_root}>
        <Header />
        <Router>
          <Route path="/" component={SetBrowser} />
          <Route path="/upload" component={Uploader} />
          <Route path="/profile" component={Profile} />
          <Route path="/callback" component={Redirect} />
          <NotFoundPage default />
        </Router>
      </div>
    </Auth0Provider>
  );
};

export default App;
