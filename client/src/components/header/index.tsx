import { Fragment, FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import { useContext } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import { Auth } from "../auth";
import style from "./style.css";

const Header: FunctionalComponent = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);

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
            fetch("http://localhost:4000/logout", {
              method: "POST",
              credentials: "include",
            })
              .then(async (res) => {
                console.log(res);
                if (res.status !== 200) throw Error();
                const json = await res.json();
                setAccessToken("");
              })
              .catch((err) => {
                console.error(err);
                setAccessToken("");
              });
          }}>
          Sign out
        </Link>
      </Auth>
    </Fragment>
  );
  return (
    <header class={`${style.header}`}>
      <h1>{`UwU`}</h1>
      <nav>{links}</nav>
    </header>
  );
};

export default Header;
