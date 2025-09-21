export type Color = "w" | "b";
export type Piece = "p" | "r" | "n" | "b" | "q" | "k";
export type Promotion = "r" | "n" | "b" | "q";

export interface PieceType {
  color: Color;
  piece: Piece;
}
