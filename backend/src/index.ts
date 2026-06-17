import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./routes/auth";
import { publicProfile, protectedProfile } from "./routes/profile";
import { authMiddleware } from "./lib/jwt";
import { prisma } from "./lib/db";
import { setupCors } from "./lib/cors";

const app = new Hono();
const isDev = process.env.NODE_ENV !== "production";

// ─── Global Middleware ────────────────────────────────────────────────────────
// Logger hanya aktif di development agar console tidak penuh di production
if (isDev) {
  app.use("*", logger());
}
app.use("*", secureHeaders());
// prettyJSON hanya di development untuk kemudahan debugging
if (isDev) {
  app.use("*", prettyJSON());
}
setupCors(app);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      version: "1.0.0",
    });
  } catch {
    return c.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
      },
      503
    );
  }
});

// ─── Public Routes ────────────────────────────────────────────────────────────
// Public profile: GET /api/profile/:username — no auth required
app.route("/api/profile", publicProfile);

// ─── Protected Routes ─────────────────────────────────────────────────────────
// Auth middleware MUST be registered BEFORE the routes that need it
app.use("/api/auth/me", authMiddleware);
app.use("/api/profile", authMiddleware);

// Auth routes (register & login are public, /me is protected by middleware above)
app.route("/api/auth", auth);

// Protected profile: GET /api/profile (own) & PUT /api/profile
app.route("/api/profile", protectedProfile);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
    404
  );
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.onError((err, c) => {
  console.error("[Unhandled Error]", err);
  return c.json(
    {
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" ? { error: err.message } : {}),
    },
    500
  );
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001;

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`\n🚀 Linktree Backend running!`);
    console.log(`   ➜  Local:   http://localhost:${info.port}`);
    console.log(`   ➜  Health:  http://localhost:${info.port}/health`);
    console.log(`   ➜  Mode:    ${process.env.NODE_ENV || "development"}\n`);
  }
);

export default app;
