import { FunctionalComponent, h } from "preact";
import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { Results } from "../../components/results";
import { SETS } from "../../helpers/queries";
import { AuthContext } from "../../helpers/token";
import { Set } from "../../helpers/types";
import style from "./style.css";

const SetManager: FunctionalComponent = () => {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [retry, setRetry] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState({
    sets: [],
    next: null,
    previous: null,
    count: 0,
  });

  const deleteSets = async () => {
    const response = await fetch(
      (process.env.PROD_URL ? process.env.PROD_URL : "http://localhost:3000") +
        "/set",
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ set_ids: selected }),
      }
    );

    if (response.status === 403 || response.status === 401)
      throw new Error(await response.json()); // if authentication error
    if (!response.ok) {
      setErrorMessage(await response.json());
      return;
    }

    setErrorMessage("");

    const author = JSON.parse(
      atob(accessToken ? accessToken.split(".")[1] : "")
    ).name;

    // clear selection, clear cache, re-fetch results
    setSelected([]);
    // fetchResults({ variables: { author } });
  };

  useEffect(() => {
    if (accessToken !== "" && retry) {
      setRetry(false);
      deleteSets()
        .then(() => {
          console.log("form submitted");
        })
        .catch((error) => {
          console.log(error);
          route("/login", true);
        });
    }
  }, [accessToken, retry]);

  // fetch sets once in the beginning
  useEffect(() => {
    if (accessToken !== "") {
      const author = JSON.parse(
        atob(accessToken ? accessToken.split(".")[1] : "")
      ).name;
      // fetchResults({ variables: { author } });
    }
  }, [accessToken]);

  const fetchData = (url, more = true) => {
    fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        console.log(res);
        if (res.status !== 200) throw Error();
        const json = await res.json();
        setResults({
          count: json.count,
          sets: more ? [...results.sets, ...json.results] : [...json.results],
          next: json.next,
          previous: json.previous,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div class={style.manager}>
      <div class={style.top}>
        <h2>My Sets</h2>{" "}
        {selected.length > 0 && (
          <button
            class={style.btn}
            onClick={async (e) => {
              e.preventDefault();
              if (retry) return; // prevent double click/spam
              if (
                !confirm(
                  `Are you sure you want to delete ${
                    selected.length === 1 ? "this set" : "these sets"
                  }?`
                )
              )
                return;

              try {
                await deleteSets();
                console.log("form submitted");
              } catch (error) {
                console.log(error);

                // reset token; this will trigger Refresh context to attempt refetch
                setAccessToken("");
                setRetry(true);
                return;
              }
            }}>
            <b>Delete</b>
          </button>
        )}
      </div>
      {errorMessage && (
        <div>
          <b style="color: red">{errorMessage}</b>
        </div>
      )}
      <Results
        results={results}
        fetchMore={() => {
          if (results.next) fetchData(results.next, true);
        }}
        editable={true}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export { SetManager };
