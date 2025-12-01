import { cn } from "@/lib/utils";
import type { FC, HTMLAttributes } from "react";
import Piece from "@/components/Piece";
import type { Color } from "@/types/Piece";

interface VisualizerProps extends HTMLAttributes<HTMLDivElement> {
  fen: string;
}

const fenCharToPiece = (fenChar: string) => {
  const isWhite = fenChar === fenChar.toUpperCase();
  const color: Color = isWhite ? "w" : "b";
  const piece = fenChar.toLowerCase();

  return { color, piece: piece as any };
};

export const Visualizer: FC<VisualizerProps> = ({
  fen,
  className,
  ...props
}) => {
  const parseFEN = (fen: string): string[][] => {
    const rows = fen.split(" ")[0].split("/");
    const board: string[][] = [];

    for (const row of rows) {
      const boardRow: string[] = [];
      for (const char of row) {
        if (isNaN(parseInt(char))) {
          boardRow.push(char);
        } else {
          const emptySquares = parseInt(char);
          for (let i = 0; i < emptySquares; i++) {
            boardRow.push("");
          }
        }
      }
      board.push(boardRow);
    }

    return board;
  };

  const board = parseFEN(fen);
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-lg",
        className
      )}
      {...props}
    >
      <div className="relative">
        <div className="grid grid-cols-8 gap-0 border-10 border-primary-200">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLightSquare = (rowIndex + colIndex) % 2 === 0;
              const file = files[colIndex];
              const rank = ranks[rowIndex];

              return (
                <div
                  key={`${file}${rank}`}
                  className={cn(
                    "w-16 h-16 flex items-center justify-center relative",
                    isLightSquare
                      ? "bg-neutral-200 text-neutral-900"
                      : "bg-neutral-500 text-neutral-100"
                  )}
                >
                  {piece && <Piece piece={fenCharToPiece(piece)} />}

                  {colIndex === 0 && (
                    <span className="absolute left-1 top-1 text-xs font-bold opacity-50">
                      {rank}
                    </span>
                  )}
                  {rowIndex === 7 && (
                    <span className="absolute right-1 bottom-1 text-xs font-bold opacity-50">
                      {file}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
