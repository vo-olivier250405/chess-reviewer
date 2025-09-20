import { EvaluatedPosition } from "@/types/Position";
import { Chess, Square } from "chess.js";
import { getOpeningByFen } from "@/lib/openings";
import { calculateEvalLoss, getEvaluationThreshold } from "./calculation";
import { CLASSIFICATIONS_MESSAGES, COLOR_VALUES } from "@/constants";
import { getMoveIsBrilliant } from "./brilliancy";
import { isPieceHanging } from "./piece";

const getMoveClassification = (
  currentPosition: EvaluatedPosition,
  lastPosition: EvaluatedPosition,
  board: Chess
) => {
  const topMove = lastPosition.topLines?.find((line) => line.id === 1);
  const secondTopMove = lastPosition.topLines?.find((line) => line.id === 2);
  if (!topMove) return;

  // compare top move evaluation with the current position's
  const lastMoveEval = topMove.evaluation;
  const currentMoveEval = currentPosition.topLines?.find(
    (line) => line.id === 1
  )?.evaluation;
  if (!lastMoveEval) return;

  const moveColor = board.turn() === "w" ? "black" : "white";

  // game is over
  if (!currentMoveEval) {
    currentPosition.topLines?.push({
      id: 1,
      depth: 0,
      moveUCI: currentPosition.move.uci,
      evaluation: { type: board.isCheckmate() ? "mate" : "cp", value: 0 },
    });
  }

  // get evaluation value
  const lastEvalValue = lastMoveEval.value * COLOR_VALUES[moveColor];
  const currentEvalValue =
    (currentMoveEval?.value || 0) * COLOR_VALUES[moveColor];
  const secondTopMoveEvalValue =
    (secondTopMove?.evaluation.value || 0) * COLOR_VALUES[moveColor];

  // handle forced moves
  if (currentPosition.topLines?.length === 1 && !secondTopMove) {
    currentPosition.classification = "forced";
    return currentPosition;
  }

  // calculate evaluation difference
  const evalLoss = calculateEvalLoss(
    lastPosition,
    currentPosition,
    moveColor,
    lastMoveEval,
    currentMoveEval
  );

  const noMate = lastMoveEval.type === "cp" && currentMoveEval?.type === "cp";

  if (topMove.moveUCI === currentPosition.move.uci) {
    currentPosition.classification = "best";
  } else {
    if (noMate) {
      // get evaluation threshold
      for (let classif of CLASSIFICATIONS_MESSAGES) {
        const evaluationThreshold = getEvaluationThreshold(
          classif,
          lastMoveEval.value
        );
        if (evalLoss <= evaluationThreshold) {
          currentPosition.classification = classif;
          break;
        }
      }
      // if no mate last move but blundered a mate
    } else if (lastMoveEval.type === "cp" && currentMoveEval?.type === "mate") {
      if (currentEvalValue > 0) {
        currentPosition.classification = "best";
      } else if (currentEvalValue >= -2) {
        currentPosition.classification = "blunder";
      } else if (currentEvalValue >= -5) {
        currentPosition.classification = "mistake";
      } else {
        currentPosition.classification = "inaccuracy";
      }
      // If mate last move and there is no longer a mate
    } else if (lastMoveEval.type == "mate" && currentMoveEval?.type == "cp") {
      if (lastEvalValue < 0 && currentEvalValue < 0) {
        currentPosition.classification = "best";
      } else if (currentEvalValue >= 400) {
        currentPosition.classification = "good";
      } else if (currentEvalValue >= 150) {
        currentPosition.classification = "mistake";
      } else if (currentEvalValue >= -100) {
        currentPosition.classification = "mistake";
      } else {
        currentPosition.classification = "blunder";
      }
      // If mate last move and forced mate still exists
    } else if (lastMoveEval.type == "mate" && currentMoveEval?.type == "mate") {
      if (lastEvalValue > 0) {
        if (currentEvalValue <= -4) {
          currentPosition.classification = "mistake";
        } else if (currentEvalValue < 0) {
          currentPosition.classification = "blunder";
        } else if (currentEvalValue < lastEvalValue) {
          currentPosition.classification = "best";
        } else if (currentEvalValue <= lastEvalValue + 2) {
          currentPosition.classification = "excellent";
        } else {
          currentPosition.classification = "good";
        }
      } else {
        if (currentEvalValue == lastEvalValue) {
          currentPosition.classification = "best";
        } else {
          currentPosition.classification = "good";
        }
      }
    }
  }

  // best move
  if (currentPosition.classification === "best") {
    currentPosition =
      getMoveIsBrilliant(
        currentPosition,
        currentEvalValue,
        lastPosition,
        secondTopMoveEvalValue,
        topMove,
        secondTopMove!,
        moveColor === "white" ? "white" : "black"
      ) ?? currentPosition;

    // great move
    try {
      if (
        noMate &&
        currentPosition.classification !== "brilliant" &&
        lastPosition.classification == "blunder" &&
        Math.abs(topMove.evaluation.value - secondTopMove?.evaluation.value!) >=
          150 &&
        !isPieceHanging(
          lastPosition.fen,
          currentPosition.fen,
          currentPosition.move.uci.slice(2, 4) as Square
        )
      ) {
        currentPosition.classification = "great";
      }
    } catch (error) {}
  }

  // blunders
  if (currentPosition.classification === "blunder" && currentEvalValue >= 600) {
    currentPosition.classification = "good";
  }

  if (
    currentPosition.classification === "blunder" &&
    lastEvalValue <= -600 &&
    lastMoveEval.type === "cp" &&
    currentMoveEval?.type === "cp"
  ) {
    currentPosition.classification = "good";
  }

  currentPosition.classification ??= "theoretical";

  // get the opening
  const opening = getOpeningByFen(currentPosition.fen);
  if (!!opening) {
    currentPosition.opening = opening;
    currentPosition.classification = "theoretical";
  }
  return currentPosition;
};

export const getReportClassification = (positions: EvaluatedPosition[]) => {
    
}
export default getMoveClassification;
