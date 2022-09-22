import { FunctionalComponent, h } from "preact";
import { getCurrentUrl } from "preact-router";
import { useEffect } from "preact/hooks";
import { Auth } from "../../components/auth";
import Creator from "../../components/creator";
import style from "./style.css";

const Uploader: FunctionalComponent = () => {
  // set title after first render
  useEffect(() => {
    document.title = "Upload | Pokebrowse";
  }, []);
  return (
    <Auth authAndRedirect={getCurrentUrl()}>
      <div class={style.upload}>
        <h2>Upload a set</h2>
        <Creator />
      </div>
    </Auth>
  );
};

export default Uploader;
