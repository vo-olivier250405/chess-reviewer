import { spawn } from "bun"
import { join } from "path"

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


export function extractCpScore(stockfishOutput: string): number {
  const lines = stockfishOutput.split('\n').reverse()

  for (const line of lines) {
    const match = line.match(/score (cp|mate) (-?\d+)/)
    if (match) {
      const type = match[1]
      const value = parseInt(match[2])
      if (type === 'cp') return value
      if (type === 'mate') return value > 0 ? 10000 : -10000
    }
  }

  return 0
}
