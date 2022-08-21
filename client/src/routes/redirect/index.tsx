import { Fragment, FunctionalComponent, h } from "preact";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";
import { Auth } from "../../components/auth";
import Creator from "../../components/creator";
import style from "./style.css";

const Redirect: FunctionalComponent = () => {
  const redirectPath = localStorage.getItem("redirectPath");
  console.log(redirectPath);
  route(redirectPath);
  return <Fragment />;
};

export default Redirect;
