import { useApolloClient } from "@apollo/client";
import { FunctionalComponent, h } from "preact";
import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext } from "../../helpers/token";
import style from "./style.css";

interface Props {
  reroute?: string;
}

// TODO: Rewrite to use function for retrying instead
const Creator: FunctionalComponent<Props> = (props: Props) => {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [retry, setRetry] = useState(false);
  const client = useApolloClient();
  const [uploadError, setUploadError] = useState("");
  const [config, setConfig] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const reroute = props.reroute ? props.reroute : "/browser";

  const upload = async () => {
    const response = await fetch("https://www.pokebrow.se/api/set", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ set: config, name, desc }),
    });

    if (response.status === 403 || response.status === 401)
      throw new Error(await response.json()); // if authentication error
    if (response.status !== 200) {
      setUploadError(await response.json());
      return;
    }

    setUploadError("");
    client.clearStore();
    window.location.reload();
  };

  useEffect(() => {
    if (accessToken !== "" && retry) {
      setRetry(false);
      upload()
        .then(() => {
          console.log("form submitted");
        })
        .catch((error) => {
          console.log(error);
          route("/login", true);
        });
    }
  }, [accessToken, retry]);

  return (
    <form
      class={style.creator}
      onSubmit={async (e) => {
        e.preventDefault();
        if (retry) return; // prevent double click/spam

        try {
          await upload();
          console.log("form submitted");
        } catch (error) {
          console.log(error);

          // reset token; this will trigger Refresh context to attempt refetch
          setAccessToken("");
          setRetry(true);
          return;
        }
      }}>
      {uploadError && (
        <div>
          <b style="color: red">{uploadError}</b>
        </div>
      )}
      <input
        type="text"
        id="name"
        value={name}
        placeholder="Name"
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
      />
      <textarea
        id="set"
        value={config}
        placeholder="Import"
        onChange={(e) => {
          setConfig(e.currentTarget.value);
        }}
      />
      <textarea
        id="desc"
        value={desc}
        placeholder="Description"
        onChange={(e) => {
          setDesc(e.currentTarget.value);
        }}
      />
      <button type="submit">Submit!</button>
    </form>
  );
};

export default Creator;
