import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Link, Route, Router } from "preact-router";

import Profile from "../routes/profile";
import SetBrowser from "../routes/browser";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import style from "./style.css";
import Uploader from "../routes/upload";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Redirect from "../routes/redirect";
import PrivacyPolicy from "../routes/privacypolicy";
import VerificationPopup from "./verification-popup";

const App: FunctionalComponent = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, [isLoading]);

  if (!origin) return <div id="preact_root" class={style.preact_root}></div>;

  console.log("isLoading: " + isLoading);
  console.log("isAuthenticated: " + isAuthenticated);
  console.log("email_verified: " + user?.email_verified);
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
        <VerificationPopup />
        <div class={style.content}>
          <Header />
          <Router>
            <Route path="/" component={SetBrowser} />
            <Route path="/upload" component={Uploader} />
            {/* <Route path="/profile" component={Profile} /> */}
            <Route path="/callback" component={Redirect} />
            <Route path="/privacypolicy" component={PrivacyPolicy} />
            <NotFoundPage default />
          </Router>
        </div>
        <Link href="/privacypolicy">Privacy Policy</Link>
      </div>
    </Auth0Provider>
  );
};

export default App;
