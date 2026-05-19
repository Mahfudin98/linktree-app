// ─── Core Data Types ──────────────────────────────────────────────────────────

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
  order?: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

/**
 * The canonical profile data structure passed to ALL template components.
 * Every template must accept these exact props.
 */
export interface ProfileData {
  username: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  templateSlug: string;
  links: Link[];
  socials: SocialLink[];
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  profile: {
    displayName: string;
    avatarUrl?: string | null;
    templateSlug: string;
  } | null;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ─── Template Registry Types ──────────────────────────────────────────────────

export interface TemplateMeta {
  slug: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export type TemplateProps = {
  data: ProfileData;
};
