import type { PieceType } from "@/types/Piece";
import type { FC } from "react";
import WhiteKing from "@/assets/king-w.svg?react";
import BlackKing from "@/assets/king-b.svg?react";
import React from "react";

interface PieceProps {
  piece: PieceType;
}

const Piece: FC<PieceProps> = ({ piece }) => {
  const PIECES: Record<string, FC<React.SVGProps<SVGSVGElement>>> = {
    wk: WhiteKing,
    bk: BlackKing,
  };

  return (
    <div>
      {PIECES[`${piece.color}${piece.piece}`] &&
        React.createElement(PIECES[`${piece.color}${piece.piece}`])}
    </div>
  );
};

export default Piece;
