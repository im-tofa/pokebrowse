import { Fragment, FunctionalComponent, h } from "preact";
import { useAuth0 } from "@auth0/auth0-react";

import style from "./style.css";
import { useEffect, useState } from "preact/hooks";

const VerificationPopup = () => {
  const { isLoading, isAuthenticated, user } = useAuth0();

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) return <Fragment />;

  return !isLoading && isAuthenticated && !user?.email_verified ? (
    <div class={style.verify}>
      Please check your email for a verification link. You need to verify your
      email, then sign out and sign back in before being able to upload and rate
      sets.
    </div>
  ) : (
    <div></div>
  );
};

export default VerificationPopup;
