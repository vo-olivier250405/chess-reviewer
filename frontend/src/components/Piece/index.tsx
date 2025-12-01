import type { PieceType } from "@/types/Piece";
import type { FC } from "react";
import WhiteKing from "@/assets/king-w.svg?react";
import BlackKing from "@/assets/king-b.svg?react";
import WhiteQueen from "@/assets/queen-w.svg?react";
import BlackQueen from "@/assets/queen-b.svg?react";
import WhiteRook from "@/assets/rook-w.svg?react";
import BlackRook from "@/assets/rook-b.svg?react";
import WhiteBishop from "@/assets/bishop-w.svg?react";
import BlackBishop from "@/assets/bishop-b.svg?react";
import WhiteKnight from "@/assets/knight-w.svg?react";
import BlackKnight from "@/assets/knight-b.svg?react";
import WhitePawn from "@/assets/pawn-w.svg?react";
import BlackPawn from "@/assets/pawn-b.svg?react";
import React from "react";

interface PieceProps extends React.SVGProps<SVGSVGElement> {
  piece: PieceType;
}

const PIECES: Record<string, FC<React.SVGProps<SVGSVGElement>>> = {
  wk: WhiteKing,
  bk: BlackKing,
  wq: WhiteQueen,
  bq: BlackQueen,
  wr: WhiteRook,
  br: BlackRook,
  wb: WhiteBishop,
  bb: BlackBishop,
  wn: WhiteKnight,
  bn: BlackKnight,
  wp: WhitePawn,
  bp: BlackPawn,
};

const Piece: FC<PieceProps> = ({ piece, className, ...props }) => {
  const PieceComponent = PIECES[`${piece.color}${piece.piece}`];

  return PieceComponent ? (
    <PieceComponent className={className} {...props} />
  ) : null;
};

export default Piece;
