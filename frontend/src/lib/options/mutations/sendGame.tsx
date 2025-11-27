import api from "@/lib/axios";
import type { AnalyzedGame } from "@/types/Game";
import type { UseMutationOptions } from "@tanstack/react-query";

export const getSendGameMutation = (
  pgn: string,
  name: string
): UseMutationOptions<{ data: AnalyzedGame }, Error, any> => {
  return {
    mutationKey: ["send-pgn", name, pgn],
    mutationFn: async () => api.post("/games/analyze/", { pgn, name }),
  };
};

export const getAnalyzeGameMutation = (pgn: string) => {
  const ANALYZE_BASE_URL = import.meta.env.VITE_ANALYZER_API_URL;
  const ANALYZE_TOKEN = import.meta.env.VITE_ANALYZER_API_TOKEN;

  return {
    mutationKey: ["analyze-game", pgn],
    mutationFn: async () => {
      const response = await fetch(`${ANALYZE_BASE_URL}/analyze/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${ANALYZE_TOKEN}`,
        },
        body: JSON.stringify({ pgn }),
      });
      return response.json();
    },
  };
};
