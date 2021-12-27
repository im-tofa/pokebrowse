import { FunctionalComponent, h } from "preact";
import { Auth } from "../../components/auth";
import Creator from "../../components/creator";
import style from "./style.css";

const Uploader: FunctionalComponent = () => {
  return (
    <Auth rerouteIfSignedOut="/login">
      <div class={style.upload}>
        <h2>Set Uploader</h2>
        <Creator />
      </div>
    </Auth>
  );
};

export default Uploader;
