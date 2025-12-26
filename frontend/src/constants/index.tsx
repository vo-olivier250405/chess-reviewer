import type { SearchModeOption } from "@/types/SearchMode";

export const MODES: SearchModeOption[] = [
  {
    label: "Chess.com",
    value: "chesscom",
  },
  {
    label: "Lichess",
    value: "lichess",
  },
  {
    label: "PGN Upload",
    value: "pgn",
  },
];

export const FIRST_POSITION_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
