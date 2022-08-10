import { Fragment, FunctionalComponent, h } from "preact";
import { Link, route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import style from "./style.css";
import Cookies from "js-cookie";

const LoginForm: FunctionalComponent = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loginError, setLoginError] = useState("");
  // console.log(accessToken);

  // get CSRF token, any GET request will do
  useEffect(() => {
    fetch(process.env.LOGIN_URL + "/login", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {})
      .catch((err) => console.error(err));
  }, []);
  return (
    <form
      class={style.form}
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("form submitted");
        const form = new FormData(e.currentTarget);
        //console.log(username, password);
        try {
          const response = await fetch(process.env.LOGIN_URL + "/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
              credentials: "include",
            },
            body: new URLSearchParams(
              new FormData(e.currentTarget) as any
            ).toString(),
          });

          console.log(response);

          if (response.status !== 200) {
            setLoginError("incorrect login credentials");
            setAuthenticated(false);
            localStorage.removeItem("user");
            return;
          }
          setLoginError("");
          localStorage.setItem("user", "signed_in");
          setAuthenticated(true);
          route("/browser", true);
        } catch (error) {
          console.log("Error: ");
          console.log(error);
          setAuthenticated(false);
          route("/login", true);
        }
      }}>
      {loginError && (
        <div>
          <b style="color: red">{loginError}</b>
        </div>
      )}
      <input
        name="username"
        value={username}
        placeholder="username"
        onChange={(e) => setUsername(e.currentTarget.value || "")}
      />
      <input
        name="password"
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.currentTarget.value || "")}
      />
      <div>
        <span>Remember me</span>
        <input
          name="remember-me"
          type="checkbox"
          onChange={(e) => setRemember(e.currentTarget.checked || false)}
        />
      </div>
      <button type="submit">Sign in</button>
    </form>
  );
};

export default LoginForm;
