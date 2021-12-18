/**
 * Pokémon Showdown uses a global dex for the teambuilder,
 * that is essentially a js/ts file with all content in it
 * as a js object, since the teambuilder rarely changes &
 * is limited. My application intends to share sets between
 * users, and the sets can be arbitrary, so a database is
 * needed to store this. Communication with a database thus
 * needs to occur through a server, to validate any searches
 * before requesting from the database.
 *
 */

/* style */
import style from "./style.css";

/* preact types */
import { Component, FunctionalComponent, h, Fragment } from "preact";
import {
    useState,
    useCallback,
    useReducer,
    useEffect,
    useContext,
} from "preact/hooks";

/* apollo client */
import {
    ApolloProvider,
    ApolloClient,
    useQuery,
    gql,
    useLazyQuery,
} from "@apollo/client";

/* custom components */
import { SearchComponent } from "../../components/search";
import { ResultComponent } from "../../components/results";

/* misc types */
import parseInput from "./tokenizer";
import dummy_response from "./dummy_response";
import { AuthContext } from "../../token";
import { Link, route } from "preact-router";
import { Sidebar } from "../../components/sidebar";
import { Panel } from "../../components/panel";
import Creator from "../../components/creator";
import { Auth } from "../../components/auth";
import LoginForm from "../../components/login";

interface Props {}

const dummy_results = dummy_response;

const SetBrowser: FunctionalComponent<Props> = (props: Props) => {
    const [results, setResults] = useState([]);
    const signIn = (
        <Panel>
            <h2>Sign In</h2>
            <LoginForm />
            <small>
                No account? <Link href="/register">Sign up</Link>!
            </small>
        </Panel>
    );
    //console.log(results);
    return (
        <main class={style.main}>
            <div class={style.setbrowser}>
                <SearchComponent
                    setResults={(searchResults) => setResults(searchResults)}
                />
                <ResultComponent sets={results} />
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