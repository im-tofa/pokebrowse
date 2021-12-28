# pokebrowse

A web application for uploading and browsing Pokémon sets.

![](./images/browser.png)

## Overview

The application provides two services: _browse_ and _upload_.

### Browse

Browsing can be done by anyone, even if they are not signed in, by accessing the `/browser` route on the client (e.g `https://localhost:8080/browser`). To search for sets, first add filters by typing them into the input bar. Then, when you have added the desired filters, click the Search button. The results can then be clicked, providing a popup with the import and full description of the set. The input format for the available filters are:

- `/species <pokemon>`: Allow this Pokémon in the search results. Add multiple `/species` filters to allow multiple species. Having no `/species` filters means all Pokémon are allowed.
- `/author <name>`: Only allow sets from this author in the search results.
- `/date <yyyy-mm-dd>`: Only allow sets uploaded no earlier than this date in the search results.
- `/speed <number>`: Only allow sets with a speed no lower than the specified number. Takes the base stats, level, EVs, IVs and nature into account but not the item or ability.
- Other filters: TBD

### Upload

Uploading sets can only be done if you are signed into an account, by accessing the `/upload` route on the client (e.g `https://localhost:8080/upload`). To upload a set, simply provide a name, an import in PS format and a description of the set! You can delete sets later on by going to your profile, located on the `/profile` route on the client.

## NOTE: ONLY use this locally!

Please run the server and client locally, do not serve it over the Internet :) this is a personal project meant for learning and may not be fully secure or even legal to publish. Only use this locally if you want to use it! You could, however, technically have a shared PostgreSQL database among your friends if you want to share sets with each other, just make sure to [configure the database](configs/README.md)!
