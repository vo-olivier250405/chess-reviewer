import api from "@/lib/axios";
import type { UseMutationOptions } from "@tanstack/react-query";

export const getLogoutMutation = (
  username: string
): UseMutationOptions<any, Error, any> => {
  return {
    mutationKey: ["logout", username],
    mutationFn: async () => api.post("/logout/", { username }),
  };
};
