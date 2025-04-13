type GameStatut = "win" | "checkmated" | "stalemate" | "timeout" | "resigned" | "abandoned" | "draw" | "unknown";
type GameTypeClass = "blitz" | "bullet" | "daily" | "live" | "rapid" | "puzzle" | "tactics" | "correspondence" | "chess960" | "variant";

interface Game {
    id: string;
    url: string;
    pgn: string;
    end_time: number;
    time_control: string;
    rated: boolean;
    accuracies: {
        white: number;
        black: number;
    }
    tcn: string;
    uuid: string;
    initial_setup: string;
    fen: string;
    time_class: GameTypeClass;
    rules: string;
    white: {
        rating: number,
        result: GameStatut,
        "@id": string,
        username: string,
        uuid: string
    };
    black: {
         rating: number,
        result: GameStatut,
        "@id": string,
        username: string,
        uuid: string
    };
    eco: string;
}

export type { Game, GameStatut, GameTypeClass };