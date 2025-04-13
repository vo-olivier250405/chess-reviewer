import { Game } from "../types/Game";

const CHESS_COM_API_URL = "https://api.chess.com/pub";
const CHESS_COM_PLAYER_URL = `${CHESS_COM_API_URL}/player`;

const getUserGames = async (username: string): Promise<Game[]> => {
    const response = await fetch(`${CHESS_COM_PLAYER_URL}/${username}/games/archives`);
    if (!response.ok) throw new Error(`Failed to fetch data for user: ${username}`);
    const { archives } = await response.json();
    const allGames = archives.map((url: string) => fetch(url).then((r) => r.json()).catch((e) => new Error(`Failed: ${e}`)));
    const games = await Promise.all(allGames);
    return games.flatMap(g => g.games)
}

const getGameById = async (username: string, gameId: string): Promise<Game> => {
    const response = await fetch(`${CHESS_COM_PLAYER_URL}/${username}/games/${gameId}`);
    if (!response.ok)throw new Error(`Failed to fetch data for game: ${gameId}`);
    const game = await response.json();
    return game;
}

export { getUserGames, getGameById };