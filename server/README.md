# set-browser
APP SETUP:
SERVER
1. `/graphql` route for all data fetching, the data requires no authorization or authentication. Has nothing to do with rest of the app.
CLIENT & SERVER
2. `/register` to register a new account.
3. `/login` to log in. upon login, the user should have a dashboard tab that shows your own sets, and an option to upload another set. 
4. `/logout` to log out.
CLIENT
5. `/setbrowser` actual client for browsing sets.

# TODO
* Implement uploading sets
* Modify database for sets to include column for descriptions
* https for database connection
* implement using uploaded sets for queries