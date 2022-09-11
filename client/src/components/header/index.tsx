import { Fragment, FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useContext } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { Auth } from "../auth";
import style from "./style.css";
import LoginButton from "../login-button";
import LogoutButton from "../logout-button";

const Header: FunctionalComponent = () => {
  const links = (
    <Fragment>
      <Link activeClassName={style.active} href="/">
        Browse
      </Link>
      <Link activeClassName={style.active} href="/upload">
        Upload
      </Link>
      <Auth notAuth={<Fragment />}>
        <Link activeClassName={style.active} href="/profile">
          Profile
        </Link>
      </Auth>
      <Auth notAuth={<LoginButton />}>
        <LogoutButton />
      </Auth>
    </Fragment>
  );
  return (
    <header class={`${style.header}`}>
      <img
        class={style.icon}
        src={`https://play.pokemonshowdown.com/sprites/gen5ani/rotom.gif`}
        onError={(event) => {
          if (
            event.currentTarget.src ===
            `https://play.pokemonshowdown.com/sprites/itemicons/0.png`
          )
            return;
          event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/itemicons/0.png`;
        }}></img>
      <nav>{links}</nav>
    </header>
  );
};

export default Header;
