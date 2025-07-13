import { Classification } from "./Classification";
import { StockfishLine } from "./Evaluation";

export interface Opening {
    name: string;
    fen: string;
}
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
    opening?: Opening
    classification?: Classification
}