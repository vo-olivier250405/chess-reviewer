import Stockfish, { StockfishOptions } from "@/services/stockfish";
import { EvaluatedPosition, Position } from "@/types/Position";

const MAX_WORKERS = 8;

const evaluate = async (
    positions: Position[],
    options: StockfishOptions,
    onProgress?: (progress: number, message: string) => void
): Promise<EvaluatedPosition[]> => {
    const pending: Promise<void>[] = [];
    const evaluated: EvaluatedPosition[] = [];
    let activeWorkers = 0;

    let completed = 0;
    const total = positions.length;

    const stockfish = new Stockfish();
    return new Promise((resolve) => {
        const tryLaunchNext = () => {
            while (activeWorkers < MAX_WORKERS && positions.length > 0) {
                const position = positions.shift()!;
                activeWorkers++;

                const task = stockfish.evaluate(position.fen, options)
                    .then((lines) => {
                        evaluated.push({
                            ...position,
                            topLines: lines.sort((a, b) => a.id - b.id),
                        });
                    })
                    .catch((err) => {
                        console.error("Evaluation failed:", err);
                        evaluated.push({
                            ...position,
                            topLines: [],
                        });
                    })
                    .finally(() => {
                        activeWorkers--;
                        completed++;

                        const progress = (completed / total) * 100;
                        onProgress?.(progress, `Evaluating positions... (${progress.toFixed(1)}%)`);

                        tryLaunchNext();

                        if (completed === total) resolve(evaluated)
                    });

                pending.push(task);
            }
        };

        tryLaunchNext();
        // stockfish.stop()
    });
};

export default evaluate;
