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
import { Refresh } from "./refresh";

const App: FunctionalComponent = () => {
  const [accessToken, setAccessToken] = useState<string | null>("");

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      <Refresh>
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
      </Refresh>
    </AuthContext.Provider>
  );
};

export default App;
