/* style */
import style from "./style.css";

/* preact types */
import { FunctionalComponent, h } from "preact";

/* custom types */
import { Set } from "../../helpers/types";
import { exportSet } from "../../helpers/set";

interface ResultProps {
  set: any;
  setChosen(s: string): void;
}

const Popup: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const set = props.set;
  return (
    <div
      class={style.popup}
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
          class={style.btn}
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
              src={`https://play.pokemonshowdown.com/sprites/gen5ani/${set.importable.species.id}.gif`}
              onError={(event) => {
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/gen5/0.png`
                )
                  return;
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/gen5/${set.importable.species.id}.png`
                ) {
                  event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/0.png`;
                  return;
                }
                event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/${set.importable.species.id}.png`;
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
            <b>Rating:</b> <i class="fas fa-star" />
            <i class="fas fa-star" />
            <i class="fas fa-star" />
            <i class="far fa-star" />
            <i class="far fa-star" />
          </div>
        </div>
        <div class={style.description}>
          <h4>Description</h4>
          <div>{set.description}</div>
        </div>
        <div class={style.import}>
          <h4>Import</h4>
          <div>{exportSet(set.importable)}</div>
        </div>
      </div>
    </div>
  );
};

export { Popup };
