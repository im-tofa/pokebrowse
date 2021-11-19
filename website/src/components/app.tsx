import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import Home from '../routes/home';
import Profile from '../routes/profile';
import SetBrowser from '../routes/setbrowser';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import style from './style.css';

const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache()
});

const App: FunctionalComponent = () => {
    return (
        <ApolloProvider client={client}>
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
        </ApolloProvider>   
    );
};

export default App;
