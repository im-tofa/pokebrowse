import { useLazyQuery, useApolloClient } from "@apollo/client";
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
  const client = useApolloClient();
  const [retry, setRetry] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState<{
    sets: Set[];
    next_cursor: number | null;
  }>({ sets: [], next_cursor: null });

  const deleteSets = async () => {
    const response = await fetch("https://localhost:3000/set", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ set_ids: selected }),
    });

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
    client.clearStore(); // NOTE: A bit extreme, maybe be more precise in the cache updates
    fetchResults({ variables: { author } });
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
      fetchResults({ variables: { author } });
    }
  }, [accessToken]);

  const [fetchResults, { loading, error, data, fetchMore }] =
    useLazyQuery(SETS);

  if (loading) return <div>Loading...</div>;
  else {
    if (error) return <div>Error</div>;
    else if (data !== undefined) setResults(data.sets);
  }

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
        fetchMore={fetchMore}
        editable={true}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
};

export { SetManager };
