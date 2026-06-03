import type { PageLoad } from "./$types";
import { profileApi } from "$lib/api";
import { error } from "@sveltejs/kit";
import type { ProfileData } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
  const { username } = params;

  try {
    const response = await profileApi.getByUsername(username, fetch);

    if (!response.success || !response.data) {
      console.error(`[Loader] @${username} profile fetch returned failure or empty data:`, response);
      throw error(404, {
        message: `@${username} not found`,
      });
    }


    return {
      profile: response.data as ProfileData,
    };
  } catch (err) {
    console.error(`[Loader Exception] failed to load @${username}:`, err);
    throw err;
  }
};
