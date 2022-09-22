/**
 * Pokémon Showdown uses a global dex for the teambuilder,
 * that is essentially a js/ts file with all content in it
 * as a js object, since the teambuilder rarely changes &
 * is limited. My application intends to share sets between
 * users, and the sets can be arbitrary, so a database is
 * needed to store this. Communication with a database thus
 * needs to occur through a server, to validate any searches
 * before requesting from the database.
 */

import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useLazyQuery } from "@apollo/client";
import { SearchComponent } from "../../components/search";
import { Results } from "../../components/results";
import { useSetsQuery } from "../../components/query";

interface Props {}

const SetBrowser: FunctionalComponent<Props> = (props: Props) => {
  const [results, setResults] = useState({
    sets: [],
    next: null,
    previous: null,
    count: 0,
  });

  const {
    fetchData,
    results: { loading, error, data },
  } = useSetsQuery();

  if (loading) {
  } else {
    if (error) {
    } else {
      if (data !== undefined) {
        setResults(data.sets);
      }
    }
  }

  // set title after first render
  useEffect(() => {
    document.title = "Browse | Pokebrowse";
  }, []);

  return (
    <main class={style.main}>
      <div class={style.setbrowser}>
        <SearchComponent fetchResults={fetchResults} />
        {error && (
          <div style="padding: 0.5em 0 0 0.5em;">
            <span style="color: red">Error: {error}</span>
          </div>
        )}
        <Results results={results} fetchMore={fetchMore} />
      </div>
    </main>
  );
};

export default SetBrowser;
