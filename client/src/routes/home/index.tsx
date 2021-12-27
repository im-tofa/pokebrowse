import { Fragment, FunctionalComponent, h } from "preact";
import style from "./style.css";

const Home: FunctionalComponent = () => {
  return (
    <Fragment>
      <article class={style.home}>
        <h1>Main article area</h1>
        <p>
          In this layout, we display the areas in source order for any screen
          less that 500 pixels wide. We go to a two column layout, and then to a
          three column layout by redefining the grid, and the placement of items
          on the grid.
        </p>
      </article>
    </Fragment>
  );
};

export default Home;
