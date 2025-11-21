import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/axios";
import type { AuthStore } from "@/types/AuthStore";

const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      expiry: null,
      user: null,
      isAuthenticated: () => {
        const state = get();
        return !(
          !state.token ||
          !state.user ||
          !state.expiry ||
          new Date(state.expiry) < new Date()
        );
      },
      setAuth: (token, expiry, user) => set(() => ({ token, expiry, user })),
      setToken: (token, expiry) => set(() => ({ token, expiry })),
      clearAuth: () => set(() => ({ token: null, expiry: null, user: null })),
      refetch: async () =>
        api.get(`/user/me/`).then(({ data: user }) => {
          set((state) => ({ ...state, user }));
        }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

export default useAuth;
