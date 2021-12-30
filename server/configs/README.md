# Configs

Pokebrowse runs over HTTPS (except for the database) and uses a PostgreSQL database for storing sets and (hashed) login credentials. It uses JWT tokens for authentication of signed in users. As such, some configuration is required to get the application up and running.

The following files are required, and should be placed in this directory:

- `.env` file for environment variables, and
- `cert.pem` and `key.pem` for HTTPS. If you want to run the application over HTTP instead, you'd have to modify the fetch requests made from the client to the server and login server, as well as modify the server and login server to use HTTP instead of HTTPS with ExpressJS. Using HTTP would not require any `.pem` files, but makes the application less safe.

## .env

The `.env` file should contain the following variables, with appropriate values (examples values are given):

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

## \*.pem

To make the services trusted by browsers, a Certificate Authority is your best bet. If you don't care about that, you can just create a self-signed certificate. [Here is a guide to generate self-signed .pem-files using OpenSSL](https://stackoverflow.com/questions/10175812/how-to-generate-a-self-signed-ssl-certificate-using-openssl).

Browsers will not trust self-signed certificates by default, but you have the option to access the website anyway. You could also configure your browser to trust your self-signed certificate specifically.

**NOTE:** If you choose to use a self-signed certificate without configuring your browser to trust the certificate, you can get around it by manually accessing the server (`https://localhost:3000`), login server (`https://localhost:4000`) and client (`https://localhost:8080`) through the browser and "access the website anyway" to make the browser temporarily trust the service.
