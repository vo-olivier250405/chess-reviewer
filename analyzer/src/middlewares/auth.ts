import { Context, Next } from "hono";

const ANALYZER_API_TOKEN = process.env.ANALYZER_API_TOKEN || "";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  {
    if (!authHeader || !authHeader.startsWith("Token ")) {
      return c.json(
        {
          error: "Authentication required",
          message: "Analyze token required",
        },
        401
      );
    }

    const providedToken = authHeader.substring(6);

    if (providedToken !== ANALYZER_API_TOKEN) {
      return c.json(
        {
          error: "Authentication failed",
          message: "Invalid analyze token",
        },
        403
      );
    }

    await next();
  }
};
