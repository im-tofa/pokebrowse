import { createContext, FunctionalComponent, h } from 'preact';
import { useState, useCallback, useReducer, useEffect } from 'preact/hooks';
import { Route, Router } from 'preact-router';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';

import Home from '../routes/home';
import Profile from '../routes/profile';
import SetBrowser from '../routes/browser';
import Register from '../routes/register';
import Login from '../routes/login';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import style from './style.css';
import axios from 'axios';
import { AuthContext } from '../token';
import Uploader from '../routes/upload';

// TODO: Use Preact Context to manage the user auth., and use useContext hook as the consumer instead 
// of consumer tag
interface JWTProps {
    getAccessToken(): string | null;
    login(): boolean; // open component with prompt for username and password
    logout(): boolean; // send request to logout the refreshtoken
};

// you don't need priviliges to access the graphql data
const client = new ApolloClient({
    uri: 'https://localhost:3000/graphql',
    cache: new InMemoryCache(),
});

const requestNewToken = () => {
    return fetch('https://localhost:4000/token', { method: 'POST' })
    .then(res => {
        if(res.status !== 200) return null;
        return res.json();
    })
    .then(json => {
        return json.accessToken;
    })
    .catch(err => {
        console.error(err);
        return null;
    });
};

const App: FunctionalComponent = () => {
    const [accessToken, setAccessToken] = useState("");
    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
            <ApolloProvider client={client}>
                <div id="preact_root" class={style.preact_root}>
                    <Header />
                    <Router>
                        <Route path="/" component={Home} />
                        <Route path="/register/" component={Register} />     
                        <Route path="/login/" component={Login} />     
                        <Route path="/browser/" component={SetBrowser} />     
                        <Route path="/upload/" component={Uploader} />     
                        <Route path="/profile/" component={Profile} user="me" />
                        <Route path="/profile/:user" component={Profile} />
                        <NotFoundPage default />
                    </Router>
                    {/* <aside class={style['side']}>Sidebar</aside> */}
                    {/* <footer class={style['main-footer']}>The footer</footer> */}
                    {/* {accessToken && <button class={style.logout} onClick={(e) => {
                e.preventDefault();
                fetch('https://localhost:4000/logout', { 
                    method: 'POST',
                    credentials: 'include'
                })
                    .then(async res => {
                        console.log(res);
                        if(res.status !== 200) throw Error();
                        const json = await res.json();
                        setAccessToken("");
                    })
                    .catch(err => {
                        console.error(err);
                        setAccessToken("");
                    });
            }}>Log out</button>} */}
                </div>
            </ApolloProvider> 
        </AuthContext.Provider>  
    );
};

export default App;
