import { browser } from "$app/environment";
import { PUBLIC_API_URL } from "$env/static/public";
import type { ApiResponse, AuthUser, ProfileData } from "./types";

const BASE_URL = PUBLIC_API_URL || "http://localhost:3001";

function getAuthHeader(): HeadersInit {
  if (!browser) return {};
  const token = localStorage.getItem("lt_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJSON<T>(
  path: string,
  options: RequestInit & { fetch?: typeof fetch } = {}
): Promise<ApiResponse<T>> {
  const fetchFn = options.fetch || fetch;
  const { fetch: _, ...fetchOptions } = options;
  const url = `${BASE_URL}${path}`;


  try {
    const response = await fetchFn(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...fetchOptions.headers,
      },
    });


    if (!response.ok) {
      console.error(`[API Error] ${url} failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (err) {
    console.error(`[API Exception] ${url} threw an exception:`, err);
    throw err;
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  register: (body: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) =>
    fetchJSON<{ user: AuthUser; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    fetchJSON<{ user: AuthUser; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => fetchJSON<AuthUser>("/api/auth/me"),
};

// ─── Profile API ──────────────────────────────────────────────────────────────

export const profileApi = {
  getByUsername: (username: string, customFetch?: typeof fetch) =>
    fetchJSON<ProfileData>(`/api/profile/${username}`, { fetch: customFetch }),

  getOwn: () => fetchJSON<ProfileData>("/api/profile"),

  update: (body: Partial<ProfileData> & { isPublic?: boolean }) =>
    fetchJSON<ProfileData>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};
