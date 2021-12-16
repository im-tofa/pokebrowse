import style from "./style.css";

import { Component, FunctionalComponent, h, Fragment } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../token";
import { route } from "preact-router";

interface Props {
    notAuth: h.JSX.Element;
    children?: any;
}

/**
 * This component enforces an authentication check and
 * allows a redirect to another route on failure.
 * @param props
 * @returns
 */
const Auth: FunctionalComponent<Props> = (props: Props) => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [authenticated, setAuthenticated] = useState(null);

    if (!accessToken) return <Fragment>{props.notAuth}</Fragment>;

    return <Fragment>{props.children}</Fragment>;
};

export { Auth };
