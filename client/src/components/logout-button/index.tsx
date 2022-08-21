import { Fragment, FunctionalComponent, h } from "preact";
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.css";
import { useEffect, useState } from "preact/hooks";

const LogoutButton = () => {
  const { logout, isLoading } = useAuth0();

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <button onClick={() => logout({ returnTo: origin })}>
      {isLoading || "Sign out"}
    </button>
  );
};

export default LogoutButton;
