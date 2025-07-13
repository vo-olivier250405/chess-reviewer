import { getMoveClassification } from "./chess";
import { EvaluatedPosition } from "@/types/Position";

const analyse = async (positions: EvaluatedPosition[]) => {
    const analyzedPositions: EvaluatedPosition[] = [];
    let idx = 0;
    for (const position of positions.slice(1)) {
        idx++;
        const classifiedPosition = getMoveClassification(positions, position, idx);
        if (!!classifiedPosition) analyzedPositions.push(classifiedPosition);
    }
    return analyzedPositions;
}

export default analyse;