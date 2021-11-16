import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Home from '../routes/home';
import Profile from '../routes/profile';
import SetBrowser from '../routes/setbrowser';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import style from './style.css';

const App: FunctionalComponent = () => {
    return (
        <div id="preact_root" class={style.preact_root}>
            <Header />
            <Router>
                <Route path="/" component={Home} />
                <Route path="/setbrowser/" component={SetBrowser} />     
                <Route path="/profile/" component={Profile} user="me" />
                <Route path="/profile/:user" component={Profile} />
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
