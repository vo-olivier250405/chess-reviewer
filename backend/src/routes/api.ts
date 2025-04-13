import { Hono } from "hono";
import { getGameById, getUserGames } from "../services/chesscom";
import { analyzePgn } from "../services/stockfish";

const apiRoute = new Hono();

apiRoute.get("/", (c) => c.json({ message: "Hello from The Chess Review API!" }));

apiRoute.get("/get-user-games", async (c) => {
    const username = c.req.query("username");
    if (!username) return c.json({ message: "Username is required" }, 400);
    const games = await getUserGames(username);
    return c.json(games);
});

apiRoute.post("/analyze/", async (c) => {
    const { pgn } = await c.req.json();
    if (!pgn) return c.json({ message: "PGN is required" }, 400);
    const analyzedMove = await analyzePgn(pgn)
        .then((r) => r)
        .catch(() => new Error("Failed to analyze PGN"));
    return c.json({ analyzedMove });
});

export default apiRoute;