import api from "@/lib/axios";
import type { Auth } from "@/types/AuthStore";
import type { UseMutationOptions } from "@tanstack/react-query";

export const getLoginMutation = (
  username: string,
  password: string
): UseMutationOptions<{ data: Auth }, Error, any> => {
  return {
    mutationKey: ["login", username, password],
    mutationFn: async () => api.post("/login/", { username, password }),
  };
};
