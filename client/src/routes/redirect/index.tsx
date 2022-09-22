import { useAuth0 } from "@auth0/auth0-react";
import { Fragment, FunctionalComponent, h } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";
import { Auth } from "../../components/auth";
import Creator from "../../components/creator";
import style from "./style.css";

const Redirect: FunctionalComponent = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const redirectPath = localStorage.getItem("redirectPath");
  useEffect(() => {
    console.log(
      "isLoading: " + isLoading + ", isAuthenticated: " + isAuthenticated
    );
    console.log(redirectPath);
    route(redirectPath);
  }, []);
  return <Fragment />;
};

export default Redirect;
