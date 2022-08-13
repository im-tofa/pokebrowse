import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { Route, Router } from "preact-router";

import Home from "../routes/home";
import Profile from "../routes/profile";
import SetBrowser from "../routes/browser";
import Register from "../routes/register";
import Login from "../routes/login";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import style from "./style.css";
import { AuthContext } from "../helpers/token";
import Uploader from "../routes/upload";
import { Auth0Provider } from "@auth0/auth0-react";

const App: FunctionalComponent = () => {
  const [authenticated, setAuthenticated] = useState<
    boolean | null | undefined
  >(undefined);

  return (
    <Auth0Provider
      domain="dev-gnh7bcs1.eu.auth0.com"
      clientId="XfhFHObJfac7bUPLdK58zqaZGxsY4N3O"
      redirectUri={window.location.origin}>
      <div id="preact_root" class={style.preact_root}>
        <Header />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/register/" component={Register} />
          <Route path="/login/" component={Login} />
          <Route path="/browser/" component={SetBrowser} />
          <Route path="/upload/" component={Uploader} />
          <Route path="/profile/" component={Profile} />
          <NotFoundPage default />
        </Router>
      </div>
    </Auth0Provider>
  );
};

export default App;
