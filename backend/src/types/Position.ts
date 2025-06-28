import { StockfishLine } from "./Evaluation";

export interface Move {
    uci: string;
    san: string;
}

export interface Position {
    fen: string;
    move: Move;
}
export interface EvaluatedPosition extends Position {
    topLines?: StockfishLine[]
}