import api from "@/lib/axios";
import type { AnalyzedGame } from "@/types/Game";
import type { User } from "@/types/User";
import type { UseQueryOptions } from "@tanstack/react-query";

export const getListGameQueryOptions = (
  user: User
): UseQueryOptions<{ data: AnalyzedGame[] }, Error, AnalyzedGame[]> => ({
  queryKey: ["games", user?.username],
  queryFn: async () => api.get("/games"),
  enabled: !!user,
  select: (res) =>
    "data" in res.data ? (res.data.data as AnalyzedGame[]) : [],
});
