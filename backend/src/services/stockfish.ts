import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Evaluation, StockfishLine } from '@/types/Evaluation';

export interface StockfishOptions {
    depth: number;
    multiPV?: number;
    verbose?: boolean;
}

class Stockfish {
    private process: ChildProcessWithoutNullStreams;
    private busy = false;
    private queue: (() => void)[] = [];
    private messages: string[] = [];

    constructor() {
        const stockfishPath = path.join(__dirname, '../bin/stockfish/src/stockfish');
        this.process = spawn(stockfishPath);
        this.process.stdin.write('uci\n');
    }

    private setOptions(options: StockfishOptions) {
        this.process.stdin.write(`setoption name MultiPV value ${options.multiPV || 2}\n`);
    }

    public async evaluate(fen: string, options: StockfishOptions): Promise<StockfishLine[]> {
        return new Promise((resolve, reject) => {
            const task = async () => {
                this.busy = true;
                this.setOptions(options);

                this.process.stdin.write(`position fen ${fen}\n`);
                this.process.stdin.write(`go depth ${options.depth}\n`);

                const lines: StockfishLine[] = [];
                this.messages = [];

                const onData = (data: Buffer) => {
                    const output = data.toString().trim();
                    const parts = output.split('\n');

                    for (const message of parts) {
                        if (options.verbose) console.log(message);
                        this.messages.unshift(message);
                        if (message.startsWith('bestmove') || message.includes('depth 0')) {
                            const searchMessages = this.messages.filter(msg => msg.startsWith('info depth'));

                            for (const searchMessage of searchMessages) {
                                const idString = searchMessage.match(/multipv (\d+)/)?.[1];
                                const depthString = searchMessage.match(/depth (\d+)/)?.[1];
                                const moveUCI = searchMessage.match(/ pv ([a-h1-8]+)/)?.[1];

                                const evalMatch = searchMessage.match(/(cp|mate) (-?\d+)/);
                                if (!idString || !depthString || !moveUCI || !evalMatch) continue;

                                const evaluation: Evaluation = {
                                    type: evalMatch[1] as 'cp' | 'mate',
                                    value: parseInt(evalMatch[2])
                                };

                                if (fen.includes(' b ')) evaluation.value *= -1;

                                const id = parseInt(idString);
                                const depth = parseInt(depthString);

                                if (depth !== options.depth || lines.some(line => line.id === id)) continue;

                                lines.push({ id, depth, evaluation, moveUCI });
                            }

                            cleanup();
                            resolve(lines);
                        }
                    }
                };

                const onError = (err: Error) => {
                    cleanup();
                    reject(err);
                };

                const cleanup = () => {
                    this.process.stdout.off('data', onData);
                    this.process.stderr.off('data', onError);
                    this.busy = false;
                    this.runNext();
                };

                this.process.stdout.on('data', onData);
                this.process.stderr.on('data', onError);
            };

            if (!this.busy) {
                task();
            } else {
                this.queue.push(task);
            }
        });
    }

    private runNext() {
        if (this.queue.length > 0 && !this.busy) {
            const next = this.queue.shift();
            next?.();
        }
    }

    public stop() {
        this.process.stdin.write('quit\n');
        this.process.kill();
    }
}

export default Stockfish;
