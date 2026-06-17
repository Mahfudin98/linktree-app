import { z } from "zod";

// --- Auth Schemas ---
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// --- Profile Schemas ---
export const linkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Link title is required").max(100, "Title too long"),
  url: z.string().url("Invalid URL format"),
  icon: z.string().max(50).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional(),
});

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, "Platform is required").max(50, "Platform name too long"),
  url: z.string().url("Invalid URL format"),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(200, "Bio too long").optional().nullable(),
  avatarUrl: z.string().url("Invalid avatar URL").or(z.literal("")).optional().nullable(),
  templateSlug: z
    .enum(["minimalist", "glassmorphism", "cyberpunk"])
    .optional(),
  isPublic: z.boolean().optional(),
  umamiShareUrl: z.string().url("Invalid URL").or(z.literal("")).optional().nullable(),
  umamiScriptUrl: z.string().url("Invalid URL").or(z.literal("")).optional().nullable(),
  umamiWebsiteId: z.string().min(1, "Invalid Website ID").or(z.literal("")).optional().nullable(),
  links: z.array(linkSchema).optional(),
  socials: z.array(socialLinkSchema).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
