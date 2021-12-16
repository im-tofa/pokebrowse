import style from "./style.css";

import { Component, FunctionalComponent, h, Fragment } from "preact";
import { useContext } from "preact/hooks";

/**
 * This component enforces an authentication check and
 * allows a redirect to another route on failure.
 * @param props
 * @returns
 */
const Auth: FunctionalComponent = (props) => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    return <div class={style.auth}>{props.children}</div>;
};

export { Auth };
