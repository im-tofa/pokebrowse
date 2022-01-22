/* style */
import style from "./style.css";

/* preact types */
import { FunctionalComponent, h } from "preact";

/* custom types */
import { Set } from "../../helpers/types";
import { exportSet } from "../../helpers/set";

interface ResultProps {
  set: Set;
  setChosen(s: string): void;
}

import * as dex from "../../../../server/src/pkmnstats";
import { toID } from "../../../../server/src/utils/ps-utils";

const Popup: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const set = props.set;
  const speciesNormalized = dex[set.species].forme
    ? toID(dex[set.species].baseSpecies) + "-" + toID(dex[set.species].forme)
    : toID(dex[set.species].name);
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
              src={`https://play.pokemonshowdown.com/sprites/gen5ani/${speciesNormalized}.gif`}
              onError={(event) => {
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/gen5/0.png`
                )
                  return;
                if (
                  event.currentTarget.src ===
                  `https://play.pokemonshowdown.com/sprites/gen5/${speciesNormalized}.png`
                ) {
                  event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/0.png`;
                  return;
                }
                event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/${speciesNormalized}.png`;
              }}></img>
            <img
              class={style.icon}
              src={`https://play.pokemonshowdown.com/sprites/itemicons/${set.item
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
            <b>Author:</b> {set.author}
          </div>
          <div class={style.date}>
            <b>Uploaded on:</b>{" "}
            {new Date(set.set_uploaded_on).toLocaleDateString()}
          </div>
          <div class={style.rating}></div>
        </div>
        <div class={style.import}>
          <h4>Import</h4>
          <div>{exportSet(set)}</div>
        </div>
        <div class={style.description}>
          <h4>More info</h4>
          <span>
            <a
              href={`https://www.smogon.com/dex/ss/pokemon/${speciesNormalized}/${set.set_id}`}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation();
              }}>{`Guide on Smogon Strategy Pokédex`}</a>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export { Popup };
