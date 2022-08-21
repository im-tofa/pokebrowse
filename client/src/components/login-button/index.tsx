import { Fragment, FunctionalComponent, h } from "preact";
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.css";
import { useEffect, useState } from "preact/hooks";

const LoginButton = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <button
      onClick={() => {
        localStorage.setItem("redirectPath", "/");
        loginWithRedirect({
          redirectUri: origin + "/callback",
        });
      }}>
      {isLoading || "Sign in"}
    </button>
  );
};

export default LoginButton;
