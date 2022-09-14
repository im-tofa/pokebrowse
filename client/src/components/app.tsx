import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Link, Route, Router } from "preact-router";

import Profile from "../routes/profile";
import SetBrowser from "../routes/browser";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import style from "./style.css";
import Uploader from "../routes/upload";
import { Auth0Provider } from "@auth0/auth0-react";
import Redirect from "../routes/redirect";
import PrivacyPolicy from "../routes/privacypolicy";

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
      useRefreshTokens
      cacheLocation="localstorage"
      scope="openid profile">
      <div id="preact_root" class={style.preact_root}>
        <Header />
        <Router>
          <Route path="/" component={SetBrowser} />
          <Route path="/upload" component={Uploader} />
          <Route path="/profile" component={Profile} />
          <Route path="/callback" component={Redirect} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <NotFoundPage default />
        </Router>
        <Link href="/privacypolicy">Privacy Policy</Link>
      </div>
    </Auth0Provider>
  );
};

export default App;
