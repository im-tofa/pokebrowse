import { createContext } from "preact";

type AuthType = {
  authenticated: boolean | null | undefined;
  setAuthenticated(b: boolean | null | undefined): void;
};
export const AuthContext = createContext({
  authenticated: undefined,
  setAuthenticated: (b: boolean | null | undefined) => {},
} as AuthType);
