import { spawn } from "bun"
import { join } from "path"
import { Comment, Evaluation } from "../types/Move"
import { Chess } from "chess.js"


export function createStockfishCli() {
  const stockfishPath = join(import.meta.dir, "../bin/stockfish/src/stockfish")

  const process = spawn({
    cmd: [stockfishPath],
    stdout: 'pipe',
    stdin: 'pipe',
  })

  const writer = process.stdin
  const reader = process.stdout.getReader()

  const sendCommand = async (command: string) => {
    writer.write(new TextEncoder().encode(`${command}\n`))
  }

  const evaluatePosition = async (fen: string): Promise<string> => {
    let fullOutput = ""

    await sendCommand("uci")
    await sendCommand(`position fen ${fen}`)
    await sendCommand("go depth 15")

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = new TextDecoder().decode(value)
      fullOutput += text

      if (text.includes("bestmove")) break
    }

    return fullOutput
  }

  const stop = () => {
    process.kill();
  };

  return {
    evaluatePosition, stop
  }
}


export function extractEvalScore(stockfishOutput: string): Evaluation | null {
  const lines = stockfishOutput.split('\n').reverse()

  for (const line of lines) {
    const match = line.match(/score (cp|mate) (-?\d+)/)
    if (match) {
      return {
        type: match[1] as "cp" | "mate",
        value: parseInt(match[2]),
      }
    }
  }

  return null
}

export function formatEvaluation(score: Evaluation): string {
  if (score.type === "mate") {
    return `#${score.value}`
  }
  const val = (score.value / 100).toFixed(2)
  return (score.value >= 0 ? `+` : ``) + val
}


export function normalizeFen(fen: string): string {
  return fen.split(" ")[0]
}

export function isTheoreticalMove(fen: string, openingSet: Set<string>): boolean {
  const currentFen = normalizeFen(fen)
  console.log("current", currentFen)
  return openingSet.has(currentFen)
}


export function getComment(prev: number, current: number, replay: Chess, isTheoretical: boolean): Comment {
  const isWhite = replay.turn() === "b"
  const diff = isWhite ? current - prev : prev - current
  const loss = Math.abs(diff)

  if (isTheoretical) return { type: "theoretical", message: "Ceci est un coup théorique." }
  if (loss <= 20) return { type: "brillant", message: "Coup brillant" }
  if (loss <= 50) return { type: "good", message: "Bon coup" }
  if (loss <= 150) return { type: "inacurracy", message: "Imprécision" }
  if (loss <= 300) return { type: "mistake", message: "Erreur" }
  return { type: "blender", message: "Gaffe" }
}

