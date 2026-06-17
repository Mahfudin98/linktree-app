<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import {
    TEMPLATE_IMPORTS,
    DEFAULT_TEMPLATE,
    isValidTemplate,
  } from "$lib/templates/index";
  import type { ComponentType } from "svelte";

  let { data }: { data: PageData } = $props();

  const profile = $derived(data.profile);

  // ─── Dynamic Template Loading ─────────────────────────────────────────────
  // This is the modular system: resolve the template slug → dynamic import reactively via $effect
  let TemplateComponent = $state<ComponentType | null>(null);
  let loading = $state(true);
  let templateError = $state(false);

  $effect(() => {
    if (!profile) {
      console.warn("[$effect] profile is empty, skipping template load.");
      return;
    }

    const slug = isValidTemplate(profile.templateSlug)
      ? profile.templateSlug
      : DEFAULT_TEMPLATE;


    loading = true;
    templateError = false;

    TEMPLATE_IMPORTS[slug]()
      .then((mod) => {
        TemplateComponent = (mod as { default: ComponentType }).default;
        loading = false;
      })
      .catch((err) => {
        console.error(`[$effect] Failed to load template "${slug}"`, err);
        // Fallback to minimalist
        TEMPLATE_IMPORTS[DEFAULT_TEMPLATE]()
          .then((mod) => {
            TemplateComponent = (mod as { default: ComponentType }).default;
            loading = false;
          })
          .catch((fallbackErr) => {
            console.error(`[$effect] Fallback to "${DEFAULT_TEMPLATE}" failed:`, fallbackErr);
            templateError = true;
            loading = false;
          });
      });
  });
</script>

<svelte:head>
  <title>{profile.name} | @{profile.username}</title>
  <meta
    name="description"
    content={profile.bio ?? `Check out ${profile.name}'s links`}
  />
  <meta property="og:title" content="{profile.name} (@{profile.username})" />
  <meta property="og:description" content={profile.bio ?? ""} />
  {#if profile.avatar}
    <meta property="og:image" content={profile.avatar} />
  {/if}
  
  {#if profile.umamiScriptUrl && profile.umamiWebsiteId}
    <script defer src={profile.umamiScriptUrl} data-website-id={profile.umamiWebsiteId}></script>
  {/if}
</svelte:head>

{#if loading}
  <!-- Loading skeleton -->
  <div class="min-h-screen flex items-center justify-center bg-stone-50">
    <div
      class="w-9 h-9 border-[3px] border-zinc-200 border-t-zinc-900 rounded-full animate-spin"
    ></div>
  </div>
{:else if templateError}
  <div
    class="min-h-screen flex flex-col items-center justify-center gap-4 font-sans text-zinc-500 bg-stone-50"
  >
    <p>Failed to load template. Please try again.</p>
    <a href="/" class="text-zinc-900 font-semibold underline">← Back home</a>
  </div>
{:else if TemplateComponent}
  <TemplateComponent data={profile} />
{/if}
