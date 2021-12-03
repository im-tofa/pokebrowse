import { Fragment, FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import { useContext, useState } from 'preact/hooks';
import { AuthContext } from '../../token';
import style from './style.css';

const LoginControl: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    let login;
    console.log(accessToken);
    if(accessToken === "") login = <Fragment><Link activeClassName={style.active} href="/register">Register</Link><Link activeClassName={style.active} href="/login">Login</Link></Fragment>;
    else login = <Fragment></Fragment>;
    return login;
};

const Header: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    
    let links;
    if(!accessToken) links = (
        <Fragment>
            <Link activeClassName={style.active} href="/setbrowser">Set Browser</Link>
            <Link activeClassName={style.active} href="/register">Register</Link>
            <Link activeClassName={style.active} href="/login">Login</Link>
        </Fragment>
    );
    else links = (
        <Fragment>
            <Link activeClassName={style.active} href="/setbrowser">Set Browser</Link>
            <Link activeClassName={style.active} href="/profile">Profile</Link>            
        </Fragment>
    );
    return (
        <header class={style.header}>
            <h1>Preact App</h1>
            <nav>
                {links}
            </nav>
        </header>
    );
};

export default Header;
