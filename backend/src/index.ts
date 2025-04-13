import { Hono } from "hono";
import apiRoute from "./routes/api";

const app = new Hono();

app.get("/", (c) => c.text("Hello from The Chess Review !"));

app.route("/api", apiRoute);

export default app;