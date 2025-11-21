import type { User } from "./User";

export interface AuthStore {
  token: string | null;
  expiry: string | null;
  user: User | null;
  isAuthenticated: () => boolean;
  setAuth: (token: string, expiry: string, user: User) => void;
  setToken: (token: string, expiry: string) => void;
  clearAuth: () => void;
  refetch: () => Promise<void>;
}
