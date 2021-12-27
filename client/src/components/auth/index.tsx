import { FunctionalComponent, h, Fragment } from "preact";
import { useContext } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { route } from "preact-router";

// /login and /register
interface Props {
  notAuth?: h.JSX.Element; // this is mainly used for panels, in order to reroute.
  rerouteIfSignedOut?: string; // this is mainly used when accessing authenticated routes, in order to reroute.
  rerouteIfSignedIn?: string; // mainly used for /login and /register
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
  const { accessToken } = useContext(AuthContext);

  // check if access token exists
  if (accessToken === null) {
    // if not authenticated version is provided, return it
    if (props.notAuth) return <Fragment>{props.notAuth}</Fragment>;

    // otherwise, try to reroute if logged out, if desired
    if (props.rerouteIfSignedOut) route(props.rerouteIfSignedOut, true);

    // otherwise, if reroute is desired only if logged in, return original children
    if (props.rerouteIfSignedIn) return <Fragment>{props.children}</Fragment>;

    return <Fragment />;
  }

  // if it does, reroute if desired
  if (props.rerouteIfSignedIn) {
    route(props.rerouteIfSignedIn, true);
    return <Fragment />;
  }

  // otherwise, show authenticated content
  return <Fragment>{props.children}</Fragment>;
};

export { Auth };
