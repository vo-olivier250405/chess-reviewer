import api from "@/lib/axios";
import type { AnalyzedGame } from "@/types/Game";
import type { User } from "@/types/User";
import type { UseQueryOptions } from "@tanstack/react-query";

export const getListGameQueryOptions = (
  user: User,
  page: number = 1
): UseQueryOptions<{ data: AnalyzedGame[] }, Error, AnalyzedGame[]> => ({
  queryKey: ["games", user?.username, page],
  queryFn: async () =>
    api.get("/games", {
      params: { page },
    }),
  enabled: !!user,
  // select: (res) =>
  //   "data" in res.data ? (res.data.data as AnalyzedGame[]) : [],
});
