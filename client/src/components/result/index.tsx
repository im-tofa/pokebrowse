import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { evToString } from "../../helpers/set";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "preact/hooks";

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

  const splitText = text.split("-");
  let forme = undefined;
  if (
    splitText &&
    splitText.length > 0 &&
    [
      "galar",
      "alola",
      "therian",
      "resolute",
      "wash",
      "heat",
      "mow",
      "frost",
      "fan",
    ].includes(splitText[splitText.length - 1].toLowerCase())
  ) {
    forme = splitText.pop().toLowerCase();
  }
  if (typeof text !== "string" && typeof text !== "number") return "";

  let id = ("" + splitText.join("-")).toLowerCase().replace(/[^a-z0-9]+/g, "");
  return forme ? id + "-" + forme : id; // does not handle formes.
}

const Result: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const set = props.set;
  const [liked, setLiked] = useState(
    isAuthenticated &&
      user &&
      (set.likes
        ? set.likes.filter((e) => e.username == user.username).length != 0
        : false)
  );
  const alreadyLiked =
    isAuthenticated &&
    user &&
    (set.likes
      ? set.likes.filter((e) => e.username == user.username).length != 0
      : false);
  const onClick = props.onClick;
  return (
    <li class={`${style.result}`} onClick={onClick}>
      <div class={`${style.name}`}>
        <div>
          {set.title
            ? set.title
            : set.importable.nickname
            ? set.importable.nickname
            : set.importable.species.name}{" "}
        </div>
        <span style="width: max-content; float: right; color: red;">
          {set.isPublic ? "" : "[Private]"}
        </span>
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
        By: <i>{set.author.username}</i>
      </div>
      <div class={`${style.rating}`}>
        <i
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const token = await getAccessTokenSilently({
              audience: "https://api.pokebrow.se",
              scope: "openid",
            });

            fetch(process.env.URL + "/sets/" + set.id + "/likes", {
              method: alreadyLiked ? "DELETE" : "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => {
                if (res.status === 200) setLiked(!liked); // if already liked, unlike
              })
              .catch((e) => {
                console.error(e);
              });
          }}>
          {`${
            set.likes
              ? alreadyLiked
                ? set.likes.length + (liked ? 0 : -1)
                : set.likes.length + (liked ? 1 : 0)
              : 0 + (liked ? 1 : 0)
          }`}{" "}
          <span
            class={
              !isAuthenticated || user?.username === set.author.username
                ? style.disabled
                : style.enabled
            }>
            <div class={liked ? "fas fa-thumbs-up" : "far fa-thumbs-up"}></div>
          </span>
        </i>
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

export { Result, toID };
