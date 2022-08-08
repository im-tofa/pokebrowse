import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Set } from "../../helpers/types";
import { evToString } from "../../helpers/set";

interface ResultProps {
  set: any;
  onClick?: h.JSX.MouseEventHandler<HTMLLIElement>;
}

const Result: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const set = props.set;
  const onClick = props.onClick;
  return (
    <li class={`${style.result}`} onClick={onClick}>
      <div class={`${style.name}`}>
        <div>{set.name ? set.name : set.importable.species.name}</div>
      </div>
      <div class={`${style.wrapper} ${style.image}`}>
        {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
        {/* NOTE that species are already in ID form, from server processing */}
        {/* NOTE that forme names are not properly formatted here and won't work */}
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
      <div class={`${style.author}`}>
        By <i>{set.author.username}</i>
      </div>
      <div class={`${style.rating}`}>
        <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
        <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
      </div>
      <div class={`${style.date}`}>
        <i>{new Date(set.created).toLocaleDateString()}</i>
      </div>
      <div class={`${style.ability}`}>{set.importable.ability}</div>
      <div class={`${style.nature}`}>
        <i>{set.importable.nature}</i> Nature
      </div>
      {set.importable.evs ? (
        <div class={`${style.evs}`}>EVs: {evToString(set.importable)}</div>
      ) : (
        <div class={`${style.evs}`}></div>
      )}
      {set.importable.ivs ? (
        <div class={`${style.ivs}`}>
          IVs: {evToString(set.importable, false)}
        </div>
      ) : (
        <div class={`${style.ivs}`}></div>
      )}
      <div class={`${style.moves}`}>
        {set.importable.moves.map((move) => (
          <div>{move}</div>
        ))}
      </div>
      <div class={`${style.description}`}>
        <b>Description: </b>
        {set.description}
      </div>
    </li>
  );
};

export { Result };
