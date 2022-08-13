import { Fragment, FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useContext } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { Auth } from "../auth";
import style from "./style.css";
import Cookies from "js-cookie";
import LoginButton from "../login-button/login-button";
import LogoutButton from "../logout-button/logout-button";

const Header: FunctionalComponent = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const links = (
    <Fragment>
      <Link activeClassName={style.active} href="/browser">
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
