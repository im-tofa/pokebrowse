import { createContext } from "preact";

type AuthType = {
  accessToken: string | null;
  setAccessToken(s: string | null): void;
};
export const AuthContext = createContext({
  accessToken: "",
  setAccessToken: (s: string | null) => {},
} as AuthType);
