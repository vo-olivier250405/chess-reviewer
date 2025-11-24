import type { PieceType } from "@/types/Piece";
import type { FC } from "react";
import WhiteKing from "@/assets/king-w.svg?react";
import BlackKing from "@/assets/king-b.svg?react";
import React from "react";

interface PieceProps extends React.HTMLAttributes<HTMLDivElement> {
  piece: PieceType;
}

const PIECES: Record<string, FC<React.SVGProps<SVGSVGElement>>> = {
  wk: WhiteKing,
  bk: BlackKing,
};

const Piece: FC<PieceProps> = ({ piece, className }, ...props) => {
  return (
    <div className={className} {...props}>
      {PIECES[`${piece.color}${piece.piece}`] &&
        React.createElement(PIECES[`${piece.color}${piece.piece}`])}
    </div>
  );
};

export default Piece;
