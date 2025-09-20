import { StockfishLine } from "@/types/Evaluation";
import { EvaluatedPosition } from "@/types/Position";
import { Chess, PieceSymbol, Square } from "chess.js";
import { getAttackers, InfluencingPiece, isPieceHanging } from "./piece";
import { PIECE_VALUES, PROMOTIONS } from "@/constants";

export const getMoveIsBrilliant = (
  currentPosition: EvaluatedPosition,
  currentEvaluation: number,
  lastPosition: EvaluatedPosition,
  secondEvaluation: number,
  topMove: StockfishLine,
  secondTopMove: StockfishLine,
  moveColor: "white" | "black"
) => {
  const isWinningAnyways =
    (secondEvaluation >= 700 && topMove.evaluation.type === "cp") ||
    (topMove.evaluation.type === "mate" &&
      secondTopMove.evaluation.type === "mate");
  if (
    currentEvaluation >= 0 &&
    !isWinningAnyways &&
    currentPosition.move.san.includes("=")
  ) {
    const lastBoard = new Chess(lastPosition.fen);
    const currentBoard = new Chess(currentPosition.fen);
    if (lastBoard.isCheck()) return;

    const lastPiece = lastBoard.get(
      currentPosition.move.uci.slice(2, 4) as Square
    ) || { type: "m" };

    let sacrificedPieces: InfluencingPiece[] = [];
    for (let row of currentBoard.board()) {
      for (let piece of row) {
        if (!piece) continue;
        if (piece.color != moveColor.charAt(0)) continue;
        if (piece.type === "k" || piece.type === "p") continue;
        if (
          PIECE_VALUES[lastPiece.type as PieceSymbol] >=
          PIECE_VALUES[piece.type as PieceSymbol]
        )
          continue;

        if (
          isPieceHanging(lastPosition.fen, currentPosition.fen, piece.square)
        ) {
          currentPosition.classification = "brilliant";
          sacrificedPieces.push(piece);
        }
      }
    }

    // move is not brilliant
    let anyPieceViablyCapturable = false;
    const captureTestBoard = new Chess(currentPosition.fen);

    for (let piece of sacrificedPieces) {
      const attackers = getAttackers(currentPosition.fen, piece.square);

      for (let attacker of attackers) {
        for (let promotion of PROMOTIONS) {
          try {
            captureTestBoard.move({
              from: attacker.square,
              to: piece.square,
              promotion: promotion,
            });

            let attackerPinned = false;
            for (let row of captureTestBoard.board()) {
              for (let enemyPiece of row) {
                if (!enemyPiece) continue;
                if (enemyPiece.color === captureTestBoard.turn()) continue;
                if (enemyPiece.type === "k" || enemyPiece.type === "p")
                  continue;

                if (
                  isPieceHanging(
                    currentPosition.fen,
                    captureTestBoard.fen(),
                    enemyPiece.square
                  ) &&
                  PIECE_VALUES[enemyPiece.type as PieceSymbol] >=
                    Math.max(
                      ...sacrificedPieces.map(
                        (p) => PIECE_VALUES[p.type as PieceSymbol]
                      )
                    )
                ) {
                  attackerPinned = true;
                  break;
                }
              }
            }
            if (attackerPinned) break;

            if (PIECE_VALUES[piece.type as PieceSymbol] >= 5) {
              if (!attackerPinned) {
                anyPieceViablyCapturable = true;
                break;
              }
            } else if (
              !attackerPinned &&
              !captureTestBoard.moves().some((m) => m.endsWith("#"))
            ) {
              anyPieceViablyCapturable = true;
              break;
            }
            captureTestBoard.undo();
          } catch (error) {}
        }
        if (anyPieceViablyCapturable) break;
      }
      if (anyPieceViablyCapturable) break;
    }
    if (!anyPieceViablyCapturable) {
      currentPosition.classification = "best";
    }
  }

  return currentPosition;
};
