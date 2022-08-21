import { Fragment, FunctionalComponent, h } from "preact";
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.css";

const LogoutButton = () => {
  const { logout, isLoading } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      {isLoading || "Sign out"}
    </button>
  );
};

export default LogoutButton;
