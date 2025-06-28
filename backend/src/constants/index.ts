import { PieceSymbol } from "chess.js"
import openings from "../resssource/openings.json"

export const OPENINGS = openings

// King has no value in terms of material, but is crucial for the game
export const PIECE_VALUES: Record<PieceSymbol, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 10,
    k: 0
}

export const PROMOTIONS = [undefined, "b", "n", "r", "q"];

export const CATEGORIES = {
    blunder: 0,
    mistake: 0.2,
    inaccuracy: 0.4,
    good: 0.65,
    excellent: 0.9,
    best: 1,
    great: 1,
    brilliant: 1,
    forced: 1,
    theoretical: 1,
};