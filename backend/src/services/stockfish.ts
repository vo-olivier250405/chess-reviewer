import { Chess } from "chess.js"
import { createStockfishCli, extractCpScore } from "../lib/stockfish";

const analyzePgn = async (pgn: string) => {
    const chess = new Chess()
    const replay = new Chess()
    const analyzedMoves: AnalyzedMove[] = []
    chess.loadPgn(pgn)
    const history = chess.history({ verbose: true })
    const { evaluatePosition, stop } = createStockfishCli()

    for (let i = 0; i < history.length; i++) {
        const move = history[i]
        replay.move(move)

        const fen = replay.fen()
        const evalText = await evaluatePosition(fen)
        const cp = extractCpScore(evalText)

        analyzedMoves.push({
            moveNumber: i + 1,
            san: move.san,
            fen,
            evaluation: cp,
        })
    }
    
    stop()
    return analyzedMoves
}

export { analyzePgn }