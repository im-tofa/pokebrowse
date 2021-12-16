import { FunctionalComponent, h } from "preact";
import { Link, route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import LoginForm from "../../components/login";
import { AuthContext } from "../../token";
import style from "./style.css";

const Login: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    console.log(accessToken);

    // redirect if user already logged in
    useEffect(() => {
        fetch("https://localhost:4000/token", {
            method: "POST",
            credentials: "include",
        })
            .then(async (res) => {
                console.log(res);
                if (res.status !== 200) throw Error();
                const json = await res.json();
                setAccessToken(json.accessToken);
                // route('/upload', true);
            })
            .catch((err) => {
                // console.error(err);
                setAccessToken("");
            });
    }, []);

    return (
        <div class={style.login}>
            <h1>Sign in</h1>
            <LoginForm />
            <div>
                No account? <Link href="/register">Sign up</Link>!
            </div>
        </div>
    );
};

export default Login;
