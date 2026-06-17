import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "../config/env";

export const setupCors = (app: Hono) => {
    app.use(
        "*",
        cors({
            origin: env.corsOrigin.split(",").map((o) => o.trim()),
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowHeaders: ["Content-Type", "Authorization"],
            credentials: true,
        }),
    );
};
