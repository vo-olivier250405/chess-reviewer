import { OPENINGS } from "@/constants";
import { Opening } from "@/types/Position";

export const getOpeningByFen = (fen: string): Opening | undefined => OPENINGS.find((opening) => fen.includes(opening.fen))
