import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Set } from "../../helpers/types";
import { evToString } from "../../helpers/set";

interface ResultProps {
  set: Set;
  onClick?: h.JSX.MouseEventHandler<HTMLLIElement>;
}

import * as dex from "../../../../server/src/pkmnstats";
import { toID } from "../../../../server/src/utils/ps-utils";
const Result: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const set = props.set;
  const onClick = props.onClick;
  const speciesNormalized = dex[set.species].forme
    ? toID(dex[set.species].baseSpecies) + "-" + toID(dex[set.species].forme)
    : toID(dex[set.species].name);
  return (
    <li class={`${style.result}`} onClick={onClick}>
      <div class={`${style.name}`}>
        <a
          href={`https://www.smogon.com/dex/ss/pokemon/${speciesNormalized}/#${set.set_id}`}
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}>
          {dex[set.species].name + (set.name ? " - " + set.name : "")}
        </a>
      </div>
      <div class={`${style.wrapper} ${style.image}`}>
        {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
        {/* NOTE that species are already in ID form, from server processing */}
        {/* NOTE that forme names are not properly formatted here and won't work */}
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
      <div class={`${style.author}`}>
        By <i>{set.author}</i>
      </div>
      <div class={`${style.rating}`}>
        {/* <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={farStar}></FontAwesomeIcon> */}
      </div>
      <div class={`${style.date}`}>
        <i>{new Date(set.set_uploaded_on).toLocaleDateString()}</i>
      </div>
      <div class={`${style.ability}`}>{set.ability}</div>
      <div class={`${style.nature}`}>
        <i>{set.nature}</i> Nature
      </div>
      {set.evs ? (
        <div class={`${style.evs}`}>EVs: {evToString(set)}</div>
      ) : (
        <div class={`${style.evs}`}></div>
      )}
      {set.ivs ? (
        <div class={`${style.ivs}`}>IVs: {evToString(set, false)}</div>
      ) : (
        <div class={`${style.ivs}`}></div>
      )}
      <div class={`${style.moves}`}>
        {set.moves.map((move) => (
          <div>{move}</div>
        ))}
      </div>
    </li>
  );
};

export { Result };
