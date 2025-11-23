import api from "@/lib/axios";
import type { User } from "@/types/User";
import type { UseMutationOptions } from "@tanstack/react-query";

export const getRegisterMutation = (
  username: string,
  password: string
): UseMutationOptions<{ user: User; token: string }, Error, any> => {
  return {
    mutationKey: ["register", username, password],
    mutationFn: async () => api.post("/users/", { username, password }),
  };
};
