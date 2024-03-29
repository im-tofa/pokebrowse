/* style */
import style from "./style.css";

/* preact types */
import { FunctionalComponent, h } from "preact";

/* custom types */
import { Set } from "../../helpers/types";
import { exportSet } from "../../helpers/set";
import { toID } from "../result";
import { useEffect, useState } from "preact/hooks";

interface ResultProps {
  set: any;
  setChosen(s: string): void;
}

const Popup: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const set = props.set;
  const [height, setHeight] = useState(undefined);
  const handleWindowSizeChange = () => {
    setHeight(window.innerHeight);
  };
  const [notify, setNotify] = useState(false);

  const animate = () => {
    // Button begins to shake
    setNotify(true);

    // Buttons stops to shake after 2 seconds
    setTimeout(() => setNotify(false), 2000);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  return (
    <div
      class={style.popup}
      style={height ? `height: ${height}px` : ``}
      onClick={(e) => {
        e.preventDefault();
        props.setChosen("");
      }}>
      <div
        class={style.details}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <button
          class={`${style.btn} ${style.clickable}`}
          onClick={(e) => {
            e.preventDefault();
            props.setChosen("");
          }}>
          <i class="fa fa-times"></i>
        </button>
        <div class={style.metadata}>
          <div class={`${style.wrapper} ${style.image}`}>
            {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
            <img
              class={style.img}
              src={`https://play.pokemonshowdown.com/sprites/gen5ani/${toID(
                set.importable.species.name
              )}.gif`}
              onError={(event) => {
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/gen5/0.png`
                )
                  return;
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/gen5/${toID(
                    set.importable.species.name
                  )}.png`
                ) {
                  event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/0.png`;
                  return;
                }
                event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/${toID(
                  set.importable.species.name
                )}.png`;
              }}></img>
            <img
              class={style.icon}
              src={`https://play.pokemonshowdown.com/sprites/itemicons/${set.importable.item
                .toLowerCase()
                .split(" ")
                .join("-")}.png`}
              onError={(event) => {
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/itemicons/0.png`
                )
                  return;
                event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/itemicons/0.png`;
              }}></img>
          </div>
          <div class={style.author}>
            <b>Author:</b> {set.author.username}
          </div>
          <div class={style.date}>
            <b>Uploaded on:</b> {new Date(set.created).toLocaleDateString()}
          </div>
          <div class={style.rating}>
            <b>Likes:</b> {`${set.likes ? set.likes.length : 0}`}
          </div>
        </div>
        <div class={style.description}>
          <h4>Description</h4>
          <div>{set.description}</div>
        </div>
        <div class={style.import}>
          <h4>
            Import{" "}
            <button
              class={style.clickable}
              onClick={() => {
                navigator.clipboard.writeText(exportSet(set.importable));
                animate();
              }}>
              <i class="fa fa-clone"></i>
            </button>
            <i
              class={
                notify
                  ? `${style.checkmark} ${style.notify} fa fa-check`
                  : `${style.checkmark} fa fa-check`
              }
            />
          </h4>
          <div>{exportSet(set.importable)}</div>
        </div>
      </div>
    </div>
  );
};

export { Popup };
