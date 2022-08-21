import { FunctionalComponent, h, Fragment } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { route } from "preact-router";
import Cookies from "js-cookie";
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

  // check if access token exists
  if (!isAuthenticated) {
    // if not authenticated version is provided, return it
    if (props.notAuth) return <Fragment>{props.notAuth}</Fragment>;

    if (isLoading) return <div> Loading ... </div>;

    // otherwise, try to authenticate and redirect if desired
    if (props.authAndRedirect) {
      localStorage.setItem("redirectPath", props.authAndRedirect);
      loginWithRedirect({ redirectUri: window.location.origin + "/callback" });
      return;
    }

    // fall back to empty element
    return <Fragment />;
  }

  // otherwise, show authenticated content
  return <Fragment>{props.children}</Fragment>;
};

export { Auth };
