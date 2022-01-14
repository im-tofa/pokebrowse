# Configs

Pokebrowse runs over HTTP by default and uses a PostgreSQL database for storing sets and (hashed) login credentials. It uses JWT tokens for authentication of signed in users. As such, some configuration is required to get the application up and running.

The following files are required, and should be placed in this directory:

- `.env` file for environment variables.

## .env

For running pokebrowse on localhost, the `.env` file should contain the following variables, with appropriate values (examples values are given):

```
PGHOST='localhost'
PGUSER='dbuser'
PGPASSWORD='dbpassword'
PGDATABASE='mydatabase'
PGPORT=5432

ACCESS_TOKEN_SECRET=averylongandrandomstring
REFRESH_TOKEN_SECRET=anotherverylongandrandomstring
```

The `PG`-variables are your credentials for your PostgreSQL database. The database itself needs to be set up first, with a user that has read and write access on all tables. The tables are created using [this SQL file](../src/db/schemas.sql). The `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are used for authentication through JWT, and should be long, random strings.
