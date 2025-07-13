import { EvaluatedPosition } from "@/types/Position";
import { Chess } from "chess.js";
import { getOpeningByFen } from "@/lib/openings";

const COLOR_VALUES: { white: number; black: number } = {
    white: 1,
    black: -1
};

const getMoveClassification = (
    positions: EvaluatedPosition[],
    currentPosition: EvaluatedPosition,
    idx: number,
) => {
    const board = new Chess(currentPosition.fen)
    const lastPosition = positions[idx - 1];

    const topMove = lastPosition.topLines?.find(line => line.id === 1);
    const secondTopMove = lastPosition.topLines?.find(line => line.id === 2);
    if (!topMove) return

    // compare top move evaluation with the current position's
    const lastMoveEval = topMove.evaluation;
    const currentMoveEval = currentPosition.topLines?.find(line => line.id === 1)?.evaluation;
    if (!lastMoveEval) return;

    const moveColor = board.turn() === 'w' ? 'white' : 'black';
    // game is over
    if (!currentMoveEval) {
        currentPosition.topLines?.push(
            {
                id: 1,
                depth: 0,
                moveUCI: currentPosition.move.uci,
                evaluation: { type: board.isCheckmate() ? 'mate' : 'cp', value: 0 }
            }
        )
    }

    // get evaluation value
    const lastEvalValue = lastMoveEval.value * COLOR_VALUES[moveColor];
    const currentEvalValue = (currentMoveEval?.value || 0) * COLOR_VALUES[moveColor];
    const secondTopMoveEvalValue = (secondTopMove?.evaluation.value || 0) * COLOR_VALUES[moveColor];


    // get the opening
    const opening = getOpeningByFen(currentPosition.fen);
    if (opening) {
        currentPosition.opening = opening;
        currentPosition.classification = "theoretical";
        return currentPosition;
    }

    // handle forced moves
    if (currentPosition.topLines?.length === 1 && !secondTopMove) {
        currentPosition.classification = "forced";
        return currentPosition;
    }

    return currentPosition;
}

export default getMoveClassification