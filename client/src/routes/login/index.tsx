import { FunctionalComponent, h } from "preact";
import { Link, route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { Auth } from "../../components/auth";
import LoginForm from "../../components/login";
import { AuthContext } from "../../token";
import style from "./style.css";

const Login: FunctionalComponent = () => {
    return (
        <Auth rerouteIfSignedIn='/upload'>
            <div class={style.login}>
                <h1>Sign in</h1>
                <LoginForm />
                <div>
                    No account? <Link href="/register">Sign up</Link>!
                </div>
            </div>
        </Auth>
    );
};

export default Login;
