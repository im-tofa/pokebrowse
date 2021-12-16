import { Fragment, FunctionalComponent, h } from "preact";
import { Link, route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../token";
import style from "./style.css";

const LoginForm: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    console.log(accessToken);

    return (
        <form
            class={style.form}
            onSubmit={async (e) => {
                e.preventDefault();
                console.log("form submitted");
                //console.log(username, password);
                try {
                    const response = await fetch(
                        "https://localhost:4000/login",
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ username, password }),
                        }
                    );
                    const json = await response.json();
                    setAccessToken(json.accessToken);
                    // route("/upload", true);
                } catch (error) {
                    console.log(error);
                    route("/login", true);
                }
            }}
        >
            <input
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target?.value || "")}
            />
            <input
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target?.value || "")}
            />
            <button type="submit">Sign in</button>
        </form>
    );
};

export default LoginForm;
