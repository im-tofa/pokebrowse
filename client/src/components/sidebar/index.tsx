import style from "./style.css";

import { FunctionalComponent, h } from "preact";
const Sidebar: FunctionalComponent = (props) => {
  return <div class={style.sidebar}>{props.children}</div>;
};

export { Sidebar };
