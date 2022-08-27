import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import style from "./style.css";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  reroute?: string;
}

// TODO: Rewrite to use function for retrying instead
const Creator: FunctionalComponent<Props> = (props: Props) => {
  const { getAccessTokenSilently } = useAuth0();
  const [uploadError, setUploadError] = useState("");
  const [config, setConfig] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [goodAgainst, setGoodAgainst] = useState("");
  const [badAgainst, setBadAgainst] = useState("");

  const [location, setLocation] = useState(null);
  useEffect(() => {
    setLocation(window.location);
  }, []);

  const upload = async () => {
    const token = await getAccessTokenSilently({
      audience: "https://api.pokebrow.se",
      scope: "profile",
    });

    const response = await fetch(process.env.URL + "/sets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: name,
        description: desc,
        importable: config,
        goodAgainst: goodAgainst.replace(/\s+/g, "").split(","),
        badAgainst: badAgainst.replace(/\s+/g, "").split(","),
      }),
    });

    // const response = await fetch(process.env.URL + "/sets", {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
    //   },
    //   body: JSON.stringify({ importable: config, desc }),
    // });

    const json = await response.json();
    console.log(json);
    if (response.status === 403 || response.status === 401) {
      throw new Error(json.error); // if authentication error
    }
    if (response.status !== 200) {
      setUploadError(json.error);
      return;
    }

    setUploadError("");
    location.reload();
  };

  return (
    <form
      class={style.creator}
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await upload();
          console.log("form submitted");
        } catch (error) {
          console.log(error);
        }
      }}>
      {uploadError && (
        <div>
          <b style="color: red">{uploadError}</b>
        </div>
      )}
      <input
        type="text"
        id="title"
        value={name}
        placeholder="Title"
        required
        onChange={(e) => {
          setName(e.currentTarget.value);
        }}
      />
      <textarea
        id="set"
        value={config}
        placeholder="Import"
        required
        onChange={(e) => {
          setConfig(e.currentTarget.value);
        }}
      />
      <textarea
        id="desc"
        value={desc}
        placeholder="Description"
        required
        onChange={(e) => {
          setDesc(e.currentTarget.value);
        }}
      />
      <input
        type="text"
        id="goodAgainst"
        value={goodAgainst}
        placeholder="Good against (comma-separated list of at most 3 Pokemon)"
        onChange={(e) => {
          setGoodAgainst(e.currentTarget.value);
        }}
      />
      <input
        type="text"
        id="badAgainst"
        value={badAgainst}
        placeholder="Bad against (comma-separated list of at most 3 Pokemon)"
        onChange={(e) => {
          setBadAgainst(e.currentTarget.value);
        }}
      />
      <button type="submit">Submit!</button>
    </form>
  );
};

export default Creator;
