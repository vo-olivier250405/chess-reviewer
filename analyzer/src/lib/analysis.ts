import { CLASSIFICATIONS } from "@/constants";
import { getMoveClassification } from "./chess";
import { EvaluatedPosition } from "@/types/Position";
import { Chess } from "chess.js";
import { Classification } from "@/types/Classification";
import { AnalyzedGame } from "@/types/Game";

const analyze = async (
  positions: EvaluatedPosition[]
): Promise<AnalyzedGame> => {
  const analyzedPositions: EvaluatedPosition[] = [];
  let positionIndex = 0;
  for (let position of positions.slice(1)) {
    positionIndex++;
    const board = new Chess(position.fen);
    const lastPosition = positions[positionIndex - 1];
    const classifiedPosition = getMoveClassification(
      position,
      lastPosition,
      board
    );
    if (classifiedPosition) analyzedPositions.push(classifiedPosition);
  }

  const ACCURACIES = {
    white: {
      current: 0,
      maximum: 0,
    },
    black: {
      current: 0,
      maximum: 0,
    },
  };

  const REPORT_CLASSIFICATIONS: {
    white: Record<Classification, number>;
    black: Record<Classification, number>;
  } = {
    white: {
      brilliant: 0,
      great: 0,
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
      forced: 0,
      theoretical: 0,
    },
    black: {
      brilliant: 0,
      great: 0,
      best: 0,
      excellent: 0,
      good: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
      forced: 0,
      theoretical: 0,
    },
  };

  for (let position of positions.slice(1)) {
    const moveColor = position.fen.includes(" b ") ? "white" : "black";

    ACCURACIES[moveColor].current += CLASSIFICATIONS[position.classification!];
    ACCURACIES[moveColor].maximum++;

    REPORT_CLASSIFICATIONS[moveColor][position.classification!] += 1;
  }

  // Return complete report
  return {
    accuracies: {
      white: (ACCURACIES.white.current / ACCURACIES.white.maximum) * 100,
      black: (ACCURACIES.black.current / ACCURACIES.black.maximum) * 100,
    },
    classifications: REPORT_CLASSIFICATIONS,
    positions: positions,
  };
};

export default analyze;
