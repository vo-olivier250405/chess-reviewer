import api from "@/lib/axios";
import type { AnalyzedGame } from "@/types/Game";
import type { UseQueryOptions } from "@tanstack/react-query";

export const getDetailGameOptions = (
  id: string
): UseQueryOptions<{ data: AnalyzedGame }, Error, AnalyzedGame> => ({
  queryKey: ["games", id],
  queryFn: async () => api.get(`/games/${id}`),
  enabled: !!id,
  select: (res) => res.data,
});
