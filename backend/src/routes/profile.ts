import { Hono } from "hono";
import { prisma } from "../lib/db";
import { updateProfileSchema } from "../lib/schemas";
import { successResponse, errorResponse } from "../lib/response";
import type { JWTPayload } from "../lib/jwt";

type AuthEnv = { Variables: { jwtPayload: JWTPayload } };

// ─── Public Profile Router ────────────────────────────────────────────────────
// No auth required — mounted at /api/profile (public)
export const publicProfile = new Hono();

/**
 * GET /api/profile/:username
 * Public endpoint - fetch full linktree profile by username
 */
publicProfile.get("/:username", async (c) => {
  try {
    const { username } = c.req.param();

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        profile: {
          include: {
            links: {
              where: { isActive: true },
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                url: true,
                icon: true,
                order: true,
              },
            },
            socials: {
              select: {
                id: true,
                platform: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.profile) {
      return errorResponse(c, "Profile not found", 404);
    }

    if (!user.profile.isPublic) {
      return errorResponse(c, "This profile is private", 403);
    }

    // Shape the response for frontend consumption
    const responseData = {
      username: user.username,
      name: user.profile.displayName,
      bio: user.profile.bio,
      avatar: user.profile.avatarUrl,
      templateSlug: user.profile.templateSlug,
      umamiScriptUrl: user.profile.umamiScriptUrl,
      umamiWebsiteId: user.profile.umamiWebsiteId,
      links: user.profile.links,
      socials: user.profile.socials,
    };

    return successResponse(c, responseData);
  } catch (error) {
    console.error("[Get Profile Error]", error);
    return errorResponse(c, "Internal server error", 500);
  }
});

// ─── Protected Profile Router ─────────────────────────────────────────────────
// Auth required — mounted at /api/profile (behind authMiddleware)
export const protectedProfile = new Hono<AuthEnv>();

/**
 * GET /api/profile
 * Protected endpoint - get current user's own profile (with inactive links too)
 */
protectedProfile.get("/", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    if (!payload) {
      return errorResponse(c, "Unauthorized", 401);
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: payload.userId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        links: {
          orderBy: { order: "asc" },
        },
        socials: true,
      },
    });

    if (!profile) {
      return errorResponse(c, "Profile not found", 404);
    }

    // Shape the response for frontend consumption
    const responseData = {
      username: profile.user.username,
      name: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatarUrl,
      templateSlug: profile.templateSlug,
      umamiShareUrl: profile.umamiShareUrl,
      umamiScriptUrl: profile.umamiScriptUrl,
      umamiWebsiteId: profile.umamiWebsiteId,
      links: profile.links,
      socials: profile.socials,
      isPublic: profile.isPublic,
    };

    return successResponse(c, responseData);
  } catch (error) {
    console.error("[Get Own Profile Error]", error);
    return errorResponse(c, "Internal server error", 500);
  }
});

/**
 * PUT /api/profile
 * Protected endpoint - update authenticated user's profile & links
 */
protectedProfile.put("/", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    if (!payload) {
      return errorResponse(c, "Unauthorized", 401);
    }

    const body = await c.req.json();

    // Map frontend fields (name, avatar) to backend schema fields (displayName, avatarUrl) if provided
    const mappedBody = {
      ...body,
      displayName: body.name !== undefined ? body.name : body.displayName,
      avatarUrl: body.avatar !== undefined ? body.avatar : body.avatarUrl,
    };

    // Validate input
    const parsed = updateProfileSchema.safeParse(mappedBody);
    if (!parsed.success) {
      return errorResponse(c, "Validation failed", 422, parsed.error.flatten().fieldErrors);
    }

    const { links, socials, ...profileData } = parsed.data;

    // Check if user has a profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: payload.userId },
    });

    if (!existingProfile) {
      return errorResponse(c, "Profile not found", 404);
    }

    // Use a transaction to update profile, links, and socials atomically
    const updatedProfile = await prisma.$transaction(async (tx) => {
      // Update profile fields
      const profile = await tx.profile.update({
        where: { userId: payload.userId },
        data: {
          ...(profileData.displayName !== undefined && { displayName: profileData.displayName }),
          ...(profileData.bio !== undefined && { bio: profileData.bio }),
          ...(profileData.avatarUrl !== undefined && { avatarUrl: profileData.avatarUrl || null }),
          ...(profileData.templateSlug !== undefined && { templateSlug: profileData.templateSlug }),
          ...(profileData.isPublic !== undefined && { isPublic: profileData.isPublic }),
          ...(profileData.umamiShareUrl !== undefined && { umamiShareUrl: profileData.umamiShareUrl || null }),
          ...(profileData.umamiScriptUrl !== undefined && { umamiScriptUrl: profileData.umamiScriptUrl || null }),
          ...(profileData.umamiWebsiteId !== undefined && { umamiWebsiteId: profileData.umamiWebsiteId || null }),
        },
      });

      // Update links if provided - delete all and recreate with ordering
      if (links !== undefined) {
        await tx.link.deleteMany({ where: { profileId: profile.id } });

        if (links.length > 0) {
          await tx.link.createMany({
            data: links.map((link, index) => ({
              profileId: profile.id,
              title: link.title,
              url: link.url,
              icon: link.icon ?? null,
              isActive: link.isActive ?? true,
              order: link.order ?? index,
            })),
          });
        }
      }

      // Update social links if provided
      if (socials !== undefined) {
        await tx.socialLink.deleteMany({ where: { profileId: profile.id } });

        if (socials.length > 0) {
          await tx.socialLink.createMany({
            data: socials.map((social) => ({
              profileId: profile.id,
              platform: social.platform,
              url: social.url,
            })),
          });
        }
      }

      // Return full updated profile
      return tx.profile.findUnique({
        where: { id: profile.id },
        include: {
          user: {
            select: {
              username: true,
            },
          },
          links: {
            orderBy: { order: "asc" },
          },
          socials: true,
        },
      });
    });

    if (!updatedProfile) {
      return errorResponse(c, "Profile not found", 404);
    }

    // Shape the response for frontend consumption
    const responseData = {
      username: updatedProfile.user.username,
      name: updatedProfile.displayName,
      bio: updatedProfile.bio,
      avatar: updatedProfile.avatarUrl,
      templateSlug: updatedProfile.templateSlug,
      umamiShareUrl: updatedProfile.umamiShareUrl,
      umamiScriptUrl: updatedProfile.umamiScriptUrl,
      umamiWebsiteId: updatedProfile.umamiWebsiteId,
      links: updatedProfile.links,
      socials: updatedProfile.socials,
      isPublic: updatedProfile.isPublic,
    };

    return successResponse(c, responseData, "Profile updated successfully");
  } catch (error) {
    console.error("[Update Profile Error]", error);
    return errorResponse(c, "Internal server error", 500);
  }
});
