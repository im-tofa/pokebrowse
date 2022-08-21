import { Fragment, FunctionalComponent, h } from "preact";
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.css";

const LoginButton = () => {
  const { loginWithRedirect, isLoading } = useAuth0();
  return (
    <button
      onClick={() => {
        localStorage.setItem("redirectPath", "/");
        loginWithRedirect({
          redirectUri: window.location.origin + "/callback",
        });
      }}>
      {isLoading || "Sign in"}
    </button>
  );
};

export default LoginButton;
