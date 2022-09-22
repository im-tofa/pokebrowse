# pokebrowse

A web application for uploading and browsing Pokémon sets. This repository contains the client codebase. The server codebase is in a separate github repository.

![](./images/browser.png)

## How to Run

- `npm run build`, then `npm run serve` to start the client

## Overview

The application provides two services: _browse_ and _upload_.

### Browse

Browsing can be done by anyone, even if they are not signed in, by accessing the `/` route on the client (e.g `http://localhost:8081/`). To search for sets, first add filters by typing them into the input bar. Then, when you have added the desired filters, click the Search button. The results can then be clicked, providing a popup with the import and full description of the set. The input format for the available filters are:

- `/species <pokemon>`: Allow this Pokémon in the search results. Add multiple `/species` filters to allow multiple species. Having no `/species` filters means all Pokémon are allowed.
- `/author <name>`: Only allow sets from this author in the search results.
- `/date <yyyy-mm-dd>`: Only allow sets uploaded no earlier than this date in the search results.
- `/speed <number>`: Only allow sets with a speed no lower than the specified number. Takes the base stats, level, EVs, IVs and nature into account but not the item or ability.
- Other filters: TBD

### Upload

Uploading sets can only be done if you are signed into an account, by accessing the `/upload` route on the client (e.g `http://localhost:8081/upload`). To upload a set, simply provide a name, an import in PS format and a description of the set, then click upload! <!-- You can delete sets later on by going to your profile, located on the `/profile` route on the client.-->

## TODO list

- HTTPS connection between server and database
- Allow rating sets (must be signed in)
- More filter types (typing, rating, intended checks and counters)
- Refactor server (better code structure, split logic into reasonable files)
- Allow editing (only the description!) your uploaded sets
- Better design of `/upload` route
- Iterate design of `/profile` route
- Ensure a good enough level of security
- Ensure GDPR conformity
- Remove cookie dependency from using sprites from PS
- Rate limiting, preventing spam uploads
- Migrate to full REST or full GraphQL: I initially wanted only GraphQL but had trouble with enabling JWT authentication on only some queries, so I used REST for authenticated routes instead. But everything should be possible via GraphQL, just need to figure out how. GraphQL is nice for its typechecking alone, even if the querying capabilities of GraphQL aren't especially beneficial in this version of the app.

## License

The source code for pokebrowse is distributed under the terms of the [MIT License](LICENSE).

Functions located in [server/src/utils/ps-utils.js](server/src/utils/ps-utils.js) and [client/src/helpers/set.ts](client/src/helpers/set.ts) are adapted from the [Pokémon Showdown Client](https://github.com/smogon/pokemon-showdown-client), with permission from the copyright holder (Zarel) to distribute under an MIT license.

Pokémon and Pokémon character names are trademarks of Nintendo.
