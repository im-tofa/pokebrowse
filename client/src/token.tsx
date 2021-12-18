import { createContext } from "preact";
export const AuthContext = createContext({
    accessToken: '',
    setAccessToken: (s: string) => {}
});