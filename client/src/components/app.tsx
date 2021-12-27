import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { Route, Router } from "preact-router";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import Home from "../routes/home";
import Profile from "../routes/profile";
import SetBrowser from "../routes/browser";
import Register from "../routes/register";
import Login from "../routes/login";
import NotFoundPage from "../routes/notfound";
import Header from "./header";
import style from "./style.css";
import { AuthContext } from "../helpers/token";
import Uploader from "../routes/upload";
import { Refresh } from "./refresh";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        sets: {
          keyArgs: ["species", "speed", "author", "date"],

          merge(
            full_existing,
            full_incoming,
            {
              args: { cursor }, // args for query of incoming data
              readField,
            }
          ) {
            const existing = full_existing?.sets;
            const incoming = full_incoming?.sets;
            const merged = existing ? existing.slice(0) : [];
            let offset = offsetFromCursor(merged, cursor, readField);
            // If we couldn't find the cursor, default to appending to
            // the end of the list, so we don't lose any data.
            if (offset < 0) offset = merged.length;
            // Now that we have a reliable offset, the rest of this logic
            // is the same as in offsetLimitPagination.
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }
            return {
              sets: merged,
              next_cursor: full_incoming?.next_cursor
                ? full_incoming.next_cursor
                : null,
            };
          },
        },
      },
    },
  },
});

function offsetFromCursor(items, cursor, readField) {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i];
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (readField("set_id", item) === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1;
    }
  }
  // Report that the cursor could not be found.
  return -1;
}

// you don't need priviliges to access the graphql data
const client = new ApolloClient({
  uri: "https://localhost:3000/graphql",
  cache: cache,
});

const App: FunctionalComponent = () => {
  const [accessToken, setAccessToken] = useState<string | null>("");

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      <ApolloProvider client={client}>
        <Refresh>
          <div id="preact_root" class={style.preact_root}>
            <Header />
            <Router>
              <Route path="/" component={Home} />
              <Route path="/register/" component={Register} />
              <Route path="/login/" component={Login} />
              <Route path="/browser/" component={SetBrowser} />
              <Route path="/upload/" component={Uploader} />
              <Route path="/profile/" component={Profile} />
              <NotFoundPage default />
            </Router>
          </div>
        </Refresh>
      </ApolloProvider>
    </AuthContext.Provider>
  );
};

export default App;
