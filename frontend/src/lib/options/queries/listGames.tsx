import api from "@/lib/axios";
import type { AnalyzedGame } from "@/types/Game";
import type { User } from "@/types/User";
import type { PaginatedResponse } from "@/types/PaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";

export const getListGameQueryOptions = (
  user: User,
  page: number = 1
): UseQueryOptions<
  PaginatedResponse<AnalyzedGame>,
  Error,
  PaginatedResponse<AnalyzedGame>
> => ({
  queryKey: ["games", user?.username, page],
  queryFn: async () => {
    const response = await api.get<PaginatedResponse<AnalyzedGame>>("/games", {
      params: { page },
    });
    return response.data;
  },
  enabled: !!user,
});
