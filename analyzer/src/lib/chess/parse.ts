import { Position } from "@/types/Position"
import { Chess } from "chess.js"

const parsePgn = async (pgn: string): Promise<Position[]> => {
    if (!pgn) {
        throw new Error("PGN string is empty")
    }

    try {
        const chess = new Chess()
        chess.loadPgn(pgn)

        const moves = chess.history({ verbose: true })
        chess.reset()

        const positions: any[] = []

        for (const move of moves) {
            const fenBefore = chess.fen()

            const moveResult = chess.move(move)
            if (!moveResult) {
                throw new Error(`Invalid move: ${JSON.stringify(move)} on FEN: ${fenBefore}`)
            }

            positions.push({
                fen: fenBefore,
                move: {
                    uci: move.from + move.to + (move.promotion || ""),
                    san: move.san,
                }
            })
        }

        return positions
    } catch (error) {
        throw new Error(`Failed to parse PGN: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
}

export default parsePgn
