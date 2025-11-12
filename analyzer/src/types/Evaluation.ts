export interface Evaluation {
    type: 'cp' | 'mate';
    value: number;
}

export interface StockfishLine {
    id: number;
    depth: number;
    evaluation: Evaluation;
    moveUCI: string;
    moveSAN?: string;
}