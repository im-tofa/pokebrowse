import { FunctionalComponent, h } from "preact";
import { Link, route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { Auth } from "../../components/auth";
import style from "./style.css";

const Register: FunctionalComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // set title after first render
  useEffect(() => {
    document.title = "Register";
  }, []);
  return (
    <Auth rerouteIfSignedIn="/profile">
      <div class={style.register}>
        <h1>Sign up</h1>
        <form
          class={style.form}
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("form submitted");
            try {
              const response = await fetch(
                (process.env.PROD_LOGIN_URL
                  ? process.env.PROD_LOGIN_URL
                  : "http://localhost:4000") + "/register",
                {
                  method: "POST",
                  // credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ username, password }),
                }
              );
              route("/login", true);
            } catch (error) {
              console.log(error);
              route("/register", true);
            }
          }}>
          <input
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.currentTarget.value || "")}
          />
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.currentTarget.value || "")}
          />
          <button type="submit">Register</button>
        </form>
        <div>
          Already have an account? <Link href="/login">Sign in</Link>!
        </div>
      </div>
    </Auth>
  );
};

export default Register;
