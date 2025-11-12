import { Hono } from "hono";
import { getUserGames } from "@/services/chesscom";
import { parsePgn } from "@/lib/chess";
import evaluate from "@/lib/evaluate";
import analyze from "@/lib/analysis";

const apiRoute = new Hono();

apiRoute.get("/", (c) =>
  c.json({ message: "Hello from The Chess Review API!" })
);

apiRoute.get("/get-user-games", async (c) => {
  const username = c.req.query("username");
  if (!username) return c.json({ message: "Username is required" }, 400);
  const games = await getUserGames(username);
  return c.json(games);
});

apiRoute.post("/analyze/", async (c) => {
  const { pgn } = await c.req.json();
  const parsedPgn = await parsePgn(pgn);
  const evaluatedPositions = await evaluate(
    parsedPgn,
    {
      depth: 16,
      multiPV: 2,
    },
    (_, message) => {
      console.clear();
      console.log(`Progress: ${message}`);
    }
  );
  const analyzedPositions = await analyze(evaluatedPositions);

  return c.json({ analyzedPositions }, 200);
});

export default apiRoute;
