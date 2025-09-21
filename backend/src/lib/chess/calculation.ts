import {
  Classification,
  ClassificationThreshold,
} from "@/types/Classification";
import { Evaluation } from "@/types/Evaluation";
import { EvaluatedPosition } from "@/types/Position";

export const calculateEvalLoss = (
  lastPosition: EvaluatedPosition,
  currentPosition: EvaluatedPosition,
  moveColor: "white" | "black",
  lastMoveEval: Evaluation,
  currentMoveEval: Evaluation | undefined
) => {
  let evalLoss = Infinity;
  let lastMoveEvalLoss = Infinity;

  const matchingTopLine = lastPosition.topLines?.find(
    (l) => l.moveUCI == currentPosition.move.uci
  );

  if (matchingTopLine) {
    if (moveColor === "white") {
      lastMoveEvalLoss = lastMoveEval.value - matchingTopLine.evaluation.value;
    } else {
      lastMoveEvalLoss = matchingTopLine.evaluation.value - lastMoveEval.value;
    }
  }
  if (moveColor === "white") {
    evalLoss = lastMoveEval.value - (currentMoveEval?.value || 0);
  } else {
    evalLoss = currentMoveEval?.value! - lastMoveEval.value;
  }

  evalLoss = Math.min(evalLoss, lastMoveEvalLoss);

  return evalLoss;
};

export const getEvaluationThreshold = (
  classification: ClassificationThreshold,
  previousEvaluation: number
) => {
  const prevEvalAbs = Math.abs(previousEvaluation);
  const THRESHOLD_BY_CLASSIFICATIONS: Record<ClassificationThreshold, number> =
    {
      best: 0.0001 * Math.pow(prevEvalAbs, 2) + 0.0236 * prevEvalAbs - 3.7143,
      excellent:
        0.0002 * Math.pow(prevEvalAbs, 2) + 0.1231 * prevEvalAbs + 27.5455,
      good: 0.0002 * Math.pow(prevEvalAbs, 2) + 0.2643 * prevEvalAbs + 60.5455,
      inaccuracy:
        0.0002 * Math.pow(prevEvalAbs, 2) + 0.3624 * prevEvalAbs + 108.0909,
      mistake:
        0.0003 * Math.pow(prevEvalAbs, 2) + 0.4027 * prevEvalAbs + 225.8182,
    };

  const threshold = THRESHOLD_BY_CLASSIFICATIONS[classification] ?? Infinity;
  const res = Math.max(threshold, 0);
  return res;
};
