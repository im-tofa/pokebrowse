import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
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

  return (
    <Auth0Provider
      domain="dev-gnh7bcs1.eu.auth0.com"
      clientId="XfhFHObJfac7bUPLdK58zqaZGxsY4N3O"
      redirectUri={window.location.origin + "/callback"}
      audience={"https://api.pokebrow.se"}
      scope="openid profile">
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
