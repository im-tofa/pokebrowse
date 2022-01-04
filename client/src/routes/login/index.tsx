import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";
import { useEffect } from "preact/hooks";
import { Auth } from "../../components/auth";
import LoginForm from "../../components/login";
import style from "./style.css";

const Login: FunctionalComponent = () => {
  // set title after first render
  useEffect(() => {
    document.title = "Login";
  }, []);
  return (
    <Auth rerouteIfSignedIn="/profile">
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
