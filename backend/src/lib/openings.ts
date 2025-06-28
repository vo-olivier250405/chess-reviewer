import { OPENINGS } from "../constants";

interface Opening {
    name: string;
    fen: string;
}

export const getOpeningByFen = (fen: string): Opening | undefined => OPENINGS.find(opening => opening.fen.includes(fen))