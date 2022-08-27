import { useAuth0 } from "@auth0/auth0-react";
import { FunctionalComponent, h } from "preact";
import { getCurrentUrl } from "preact-router";
import { useEffect } from "preact/hooks";
import { Auth } from "../../components/auth";
import style from "./style.css";

const Profile: FunctionalComponent = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  // set title after first render
  useEffect(() => {
    document.title = "Profile | Pokebrowse";
  }, []);

  console.log(user);
  return (
    <Auth authAndRedirect={getCurrentUrl()}>
      <main class={style.main}>
        <div>Hello, {user.name}!</div>
      </main>
    </Auth>
  );
};

export default Profile;
