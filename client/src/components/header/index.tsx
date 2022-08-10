import { Fragment, FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useContext } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { Auth } from "../auth";
import style from "./style.css";
import Cookies from "js-cookie";

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
      <Auth
        notAuth={
          <Link activeClassName={style.active} href="/login">
            Sign in
          </Link>
        }>
        <Link
          activeClassName={style.active}
          href=""
          onClick={(e) => {
            e.preventDefault();
            fetch(process.env.LOGIN_URL + "/logout", {
              method: "POST",
              headers: {
                "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
              },
            })
              .then(async (res) => {
                console.log(res);
                if (res.status !== 200) throw Error();
                localStorage.removeItem("user");
                setAuthenticated(false);
              })
              .catch((err) => {
                console.error(err);
                localStorage.removeItem("user");
                setAuthenticated(false);
              });
          }}>
          Sign out
        </Link>
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
