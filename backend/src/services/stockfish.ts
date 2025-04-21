import { Chess } from "chess.js"
import { createStockfishCli, extractEvalScore, formatEvaluation, getComment, isTheoreticalMove, normalizeFen } from "../lib/stockfish";
import { AnalyzedMove } from "../types/Move";
import openings from "../resssource/openings.json"

const analyzePgn = async (pgn: string) => {
    const chess = new Chess()
    const replay = new Chess()
    const analyzedMoves: AnalyzedMove[] = []
    chess.loadPgn(pgn)
    const history = chess.history({ verbose: true })
    const { evaluatePosition, stop } = createStockfishCli()

    let previousEval = 0

    // const openingSet = new Set(openings.map((o: { name: string, fen: string }) => normalizeFen(o.fen)))
    const openingSet = new Set(
        openings.map((o: { name: string, fen: string }) => {
            const norm = normalizeFen(o.fen)
            if (o.name === "Queen's Gambit") {
                console.log("fen: ", norm)
            }
            return norm
        })
    )
    for (let i = 0; i < history.length; i++) {
        const move = history[i]
        replay.move(move)

        const fen = replay.fen()
        const evalText = await evaluatePosition(fen)
        const evalResult = extractEvalScore(evalText)
        if (!evalResult) continue
        const cp = evalResult
        const humanEval = formatEvaluation(evalResult)

        const isTheoretical = isTheoreticalMove(fen, openingSet)
        if (isTheoretical) {
            console.log("Théorique !")
        }
        const comment = getComment(previousEval, cp.value, replay, isTheoretical)

        analyzedMoves.push({
            moveNumber: i + 1,
            san: move.san,
            fen,
            evaluation: cp,
            comment,
            evalString: humanEval
        })
    }

    stop()
    return analyzedMoves
}

export { analyzePgn }