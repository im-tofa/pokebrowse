import { createContext } from "preact";

/* 
    TODO: Change AuthContext to instead have 
    a function for setting access token (hard
    coded fetch request) and resetting access
    token (wiping the access token). This can 
    then make it easier to manage who can 
    refresh tokens and you can refresh them on
    command e.g on request failure.    
*/
type AuthType = {
    accessToken: string | null;
    setAccessToken(s: string | null): void;
}
export const AuthContext = createContext(({
    accessToken: "",
    setAccessToken: (s: string | null) => {}
}) as AuthType);