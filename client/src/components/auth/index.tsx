import { FunctionalComponent, h, Fragment } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { route } from "preact-router";
import { useAuth0 } from "@auth0/auth0-react";

// /login and /register
interface Props {
  notAuth?: h.JSX.Element; // this is mainly used for panels, in order to reroute.
  authAndRedirect?: string;
  children?: any;
}

/**
 * This component enforces a deep authentication check and
 * allows a redirect to another route on failure.
 *
 * @param {Props} props Configuration of the Auth component
 * @returns Returns a rendered Auth component
 */
const Auth: FunctionalComponent<Props> = (props: Props) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!origin) return <Fragment />;

  // check if access token exists
  if (!isAuthenticated) {
    // if not authenticated version is provided, return it
    if (props.notAuth) return <Fragment>{props.notAuth}</Fragment>;

    if (isLoading) return <div> Loading ... </div>;

    // otherwise, try to authenticate and redirect if desired
    if (props.authAndRedirect) {
      localStorage.setItem("redirectPath", props.authAndRedirect);
      loginWithRedirect({ redirectUri: origin + "/callback" });
      return;
    }

    // fall back to empty element
    return <Fragment />;
  }

  // otherwise, show authenticated content
  return <Fragment>{props.children}</Fragment>;
};

export { Auth };
