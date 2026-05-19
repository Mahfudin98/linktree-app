/**
 * Template Registry
 * 
 * This is the heart of the modular template system.
 * 
 * HOW TO ADD A NEW TEMPLATE:
 * 1. Create a new folder: /src/lib/templates/your-slug/
 * 2. Add a Template.svelte component in that folder
 * 3. Register it below in the TEMPLATES object
 * 
 * The component MUST accept a single `data` prop of type ProfileData.
 */

import type { TemplateMeta } from "$lib/types";

// ─── Template Registry ────────────────────────────────────────────────────────
// Map of slug -> dynamic import function
// Vite resolves these at build time for optimal code splitting

export const TEMPLATE_IMPORTS: Record<string, () => Promise<{ default: unknown }>> = {
  minimalist: () => import("./minimalist/Template.svelte"),
  glassmorphism: () => import("./glassmorphism/Template.svelte"),
  cyberpunk: () => import("./cyberpunk/Template.svelte"),
  // 👇 Add new templates here:
  // retro: () => import('./retro/Template.svelte'),
};

// ─── Template Metadata ────────────────────────────────────────────────────────
export const TEMPLATE_META: TemplateMeta[] = [
  {
    slug: "minimalist",
    name: "Minimalist",
    description: "Clean, elegant, and distraction-free. Timeless monochromatic design.",
  },
  {
    slug: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass aesthetic with vibrant gradients and blur effects.",
  },
  {
    slug: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon-lit, dark, and edgy. For those who live in the matrix.",
  },
  // Add metadata for new templates here too
];

export const DEFAULT_TEMPLATE = "minimalist";

export function isValidTemplate(slug: string): boolean {
  return slug in TEMPLATE_IMPORTS;
}
