import { Fragment, FunctionalComponent, h } from "preact";
import { Link, route } from "preact-router";
import style from "./style.css";

const Home: FunctionalComponent = () => {
  route("/browser", true);

  // in case I want a dedicated start page

  return (
    <main class={style.main}>
      <h2>Welcome to pokebrowse!</h2>
      <p>
        Browse sets uploaded by other users using filters! No account required
        to browse.
      </p>
    </main>
  );
};

export default Home;
