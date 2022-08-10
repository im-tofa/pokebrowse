# TODO

- ~~eliminate GraphQL usage~~
- ~~remove remaining "refresh auth token" attempts~~
- implement new client-side auth
  - ~~login/logout requests with localstorage to remember login on client.~~
  - ~~to make results immediately available, update "accessToken"~~
  - ~~change name of accessToken context to "authenticated", a true/false/null/undefined value.~~
  - TODO prevent server from redirecting to backend login form instead of giving 200/204/401 to frontend.
  - remove the whole logic related to having three states (null, token or ""); just set true when logging in or if localStorage signifies that you are signed in, and false when logging out or on 401 errors.
- set localStorage on client side containing user id on successful authentication (for profile/dashboard, and to separate signed in from signed out on client side).
  - reset this localStorage on any 401 error received from client, or when signing out in the client.
- when signing out:
  - remove following cookies: remember-me, JSESSIONID, X-XSRF-TOKEN
  - ~~remove localStorage that stores user id to remember authentication on client side~~
  - neither of these are necessary to do but are clean (and second point helps improve user experience)
