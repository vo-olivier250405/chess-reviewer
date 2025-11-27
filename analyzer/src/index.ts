import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRoute from "./routes";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello from The Chess Review !"));

app.route("/api", apiRoute);

export default app;
