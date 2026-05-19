import jwt from "jsonwebtoken";
import type { Context } from "hono";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

export async function authMiddleware(c: Context<{ Variables: { jwtPayload: JWTPayload } }>, next: () => Promise<void>) {
  const authHeader = c.req.header("Authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return c.json({ success: false, message: "Authentication token required" }, 401);
  }

  try {
    const payload = verifyToken(token);
    c.set("jwtPayload", payload);
    await next();
  } catch {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }
}
