import { Fragment, FunctionalComponent, h } from "preact";
import { route } from "preact-router";
import { Link } from "preact-router/match";
import { useContext, useState } from "preact/hooks";
import { AuthContext } from "../../token";
import { Auth } from "../auth";
import style from "./style.css";

const LoginControl: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    let login;
    console.log(accessToken);
    if (accessToken === "")
        login = (
            <Fragment>
                <Link activeClassName={style.active} href="/register">
                    Register
                </Link>
                <Link activeClassName={style.active} href="/login">
                    Login
                </Link>
            </Fragment>
        );
    else login = <Fragment></Fragment>;
    return login;
};

const Header: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);

    const links = (
        <Fragment>
            <Link activeClassName={style.active} href="/browser">
                Browse
            </Link>
            <Link activeClassName={style.active} href="/upload">
                Upload
            </Link>
            <Auth
                notAuth={
                    <Link activeClassName={style.active} href="/login">
                        Sign in
                    </Link>
                }
            >
                <Link
                    activeClassName={style.active}
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        fetch("https://localhost:4000/logout", {
                            method: "POST",
                            credentials: "include",
                        })
                            .then(async (res) => {
                                console.log(res);
                                if (res.status !== 200) throw Error();
                                const json = await res.json();
                                setAccessToken("");
                            })
                            .catch((err) => {
                                console.error(err);
                                setAccessToken("");
                            });
                    }}
                >
                    Sign out
                </Link>
            </Auth>
        </Fragment>
    );
    return (
        <header class={`${style.header}`}>
            <h1>{`UwU`}</h1>
            <nav>{links}</nav>
        </header>
    );
};

export default Header;
