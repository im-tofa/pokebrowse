import { FunctionalComponent, h } from "preact";
import { useEffect } from "preact/hooks";
import { Auth } from "../../components/auth";
import Creator from "../../components/creator";
import { Panel } from "../../components/panel";
import { SetManager } from "../../components/set-manager";
import { Sidebar } from "../../components/sidebar";
import style from "./style.css";

const Profile: FunctionalComponent = () => {
  // set title after first render
  useEffect(() => {
    document.title = "Profile";
  }, []);
  return (
    <Auth rerouteIfSignedOut="/login">
      <main class={style.main}>
        <SetManager />
      </main>
    </Auth>
  );
};

export default Profile;
