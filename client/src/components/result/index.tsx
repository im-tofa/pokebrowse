import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Set } from "../../helpers/types";
import { evToString } from "../../helpers/set";
import { useAuth0 } from "@auth0/auth0-react";

interface ResultProps {
  set: any;
  onClick?: h.JSX.MouseEventHandler<HTMLLIElement>;
}

function toID(text) {
  if (text?.id) {
    text = text.id;
  } else if (text?.userid) {
    text = text.userid;
  }
  if (typeof text !== "string" && typeof text !== "number") return "";
  return ("" + text).toLowerCase().replace(/[^a-z0-9]+/g, ""); // does not handle formes.
}

const Result: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const set = props.set;
  const alreadyLiked =
    isAuthenticated && user && set.likes?.includes(user.name);
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
      <div class={`${style.author}`}>
        By: <i>{set.author}</i>
      </div>
      <div class={`${style.rating}`}>
        <i> Likes: {`${set.likes ? set.likes.length : 0}`}</i>
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
      {isAuthenticated && user.name !== set.author && (
        <div
          onClick={async (e) => {
            e.preventDefault();

            const token = await getAccessTokenSilently({
              audience: "https://api.pokebrow.se",
              scope: "profile",
            });

            fetch(process.env.URL + "/sets/" + set.id + "/likes", {
              method: alreadyLiked ? "DELETE" : "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).catch((e) => {
              console.error(e);
            });
          }}>
          {alreadyLiked ? "Unlike" : "Like"}
        </div>
      )}
    </li>
  );
};

export { Result };
