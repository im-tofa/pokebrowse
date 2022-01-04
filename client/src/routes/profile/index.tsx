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
        <Sidebar>
          <Panel>
            <h2>Delete Sets</h2>
            <div>
              Select items by clicking on them (they will be highlighted in
              blue). Then, press the delete button that appears in order to
              delete your sets.
              <br /> <br />
              <b>WARNING:</b> Deleting a set is an irreversible action!
            </div>
          </Panel>
          <Panel>
            <h2>Upload Set</h2>
            <Creator reroute="/profile" />
          </Panel>
        </Sidebar>
      </main>
    </Auth>
  );
};

export default Profile;
