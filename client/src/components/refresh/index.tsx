import style from "./style.css";

import { Component, FunctionalComponent, h, Fragment } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../token";
import { route } from "preact-router";

interface Props {
    children?: any;
}

/**
 * This component attempts to refresh the access token.
 * 
 * The component assumes that any failed access is handled 
 * by resetting the access token to "". 
 * 
 * @param props
 * @returns
 */
const Refresh: FunctionalComponent<Props> = (props: Props) => {
    const { accessToken, setAccessToken } = useContext(AuthContext);

    useEffect(() => {
        if(accessToken !== "") return;
        console.log("Attempting refresh ... ");
        fetch("https://localhost:4000/token", {
            method: "POST",
            credentials: "include",
        })
            .then(async (res) => {
                // console.log(res);
                const json = await res.json();
                if (res.status !== 200) throw new Error(json);
                setAccessToken(json.accessToken);
                // route('/upload', true);
                console.log("Refresh Successful!");
            })
            .catch((err) => {
                console.error(err);
                setAccessToken(null);
                console.log("Refresh failed.");
            });
    }, [accessToken]);

    return <Fragment>{props.children}</Fragment>;
};

export { Refresh };
