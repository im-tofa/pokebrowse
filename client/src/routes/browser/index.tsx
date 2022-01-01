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
import { useState } from "preact/hooks";
import { useLazyQuery } from "@apollo/client";
import { SearchComponent } from "../../components/search";
import { Results } from "../../components/results";
import { Link } from "preact-router";
import { Sidebar } from "../../components/sidebar";
import { Panel } from "../../components/panel";
import Creator from "../../components/creator";
import { Auth } from "../../components/auth";
import LoginForm from "../../components/login";
import { SETS } from "../../helpers/queries";
import { Set } from "../../helpers/types";

interface Props {}

const SetBrowser: FunctionalComponent<Props> = (props: Props) => {
  const [results, setResults] = useState<{
    sets: Set[];
    next_cursor: number | null;
  }>({ sets: [], next_cursor: null });
  const signIn = (
    <Panel>
      <h2>Sign In</h2>
      <LoginForm />
      <small>
        No account? <Link href="/register">Sign up</Link>!
      </small>
    </Panel>
  );

  const [fetchResults, { loading, error, data, fetchMore }] =
    useLazyQuery(SETS);

  if (loading) {
  } else {
    if (error) {
    } else {
      if (data !== undefined) {
        setResults(data.sets);
      }
    }
  }

  return (
    <main class={style.main}>
      <div class={style.setbrowser}>
        <SearchComponent fetchResults={fetchResults} />
        {error && (
          <div>
            <b style="color: red">{error.message}</b>
          </div>
        )}
        <Results results={results} fetchMore={fetchMore} />
      </div>
      <Sidebar>
        <Auth notAuth={signIn}>
          <Panel>
            <h2>Upload a Set</h2>
            <Creator />
          </Panel>
        </Auth>
      </Sidebar>
    </main>
  );
};

export default SetBrowser;
