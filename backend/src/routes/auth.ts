import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";
import { signToken } from "../lib/jwt";
import { registerSchema, loginSchema } from "../lib/schemas";
import { successResponse, errorResponse } from "../lib/response";
import type { JWTPayload } from "../lib/jwt";

const auth = new Hono<{ Variables: { jwtPayload: JWTPayload } }>();

/**
 * POST /api/auth/register
 * Create a new user account
 */
auth.post("/register", async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(c, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    }

    const { email, password, username, displayName } = parsed.data;

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return errorResponse(c, "Email already registered", 409);
      }
      return errorResponse(c, "Username already taken", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        profile: {
          create: {
            displayName,
            templateSlug: "minimalist",
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            templateSlug: true,
          },
        },
      },
    });

    // Sign JWT
    const token = signToken({ userId: user.id, email: user.email, username: user.username });

    return successResponse(c, { user, token }, "Account created successfully", 201);
  } catch (error) {
    console.error("[Register Error]", error);
    return errorResponse(c, "Internal server error", 500);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(c, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            templateSlug: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(c, "Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse(c, "Invalid email or password", 401);
    }

    // Sign JWT
    const token = signToken({ userId: user.id, email: user.email, username: user.username });

    return successResponse(c, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
      },
      token,
    }, "Login successful");
  } catch (error) {
    console.error("[Login Error]", error);
    return errorResponse(c, "Internal server error", 500);
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
auth.get("/me", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    if (!payload) {
      return errorResponse(c, "Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        profile: {
          include: {
            links: {
              where: { isActive: true },
              orderBy: { order: "asc" },
            },
            socials: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(c, "User not found", 404);
    }

    return successResponse(c, user);
  } catch (error) {
    console.error("[Me Error]", error);
    return errorResponse(c, "Internal server error", 500);
  }
});

export { auth };
