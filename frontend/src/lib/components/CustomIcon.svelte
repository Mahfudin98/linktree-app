<script lang="ts">
  import {
    ExternalLink,
    Globe,
    Github,
    Twitter,
    Instagram,
    Youtube,
    Twitch,
    Linkedin,
    Mail,
    Terminal,
    ShoppingBag
  } from "lucide-svelte";
  import type { ComponentType } from "svelte";

  let { name = "globe", size = 18 } = $props<{
    name?: string | null;
    size?: number;
  }>();

  const iconName = $derived((name || "globe").toLowerCase().trim());

  const lucideMap: Record<string, ComponentType> = {
    globe: Globe,
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    twitch: Twitch,
    linkedin: Linkedin,
    mail: Mail,
    terminal: Terminal,
    shoppingbag: ShoppingBag,
  };
</script>

{#if iconName === "shopee"}
  <!-- Shopee Custom Premium Outline SVG -->
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="custom-icon custom-shopee"
  >
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <rect x="5" y="10" width="14" height="11" rx="2" />
    <path d="M11 13h1.5a1.5 1.5 0 0 1 0 3H11.5a1.5 1.5 0 0 0 0 3H13" />
  </svg>
{:else}
  {#if iconName === "tokopedia"}
    <!-- Tokopedia Owl Bag SVG -->
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="custom-icon custom-tokopedia"
    >
      <rect x="4" y="8" width="16" height="13" rx="3" />
      <path d="M9 8V5a3 3 0 0 1 6 0v3" />
      <circle cx="9" cy="13.5" r="2.5" />
      <circle cx="15" cy="13.5" r="2.5" />
      <circle cx="9" cy="13.5" r="0.75" fill="currentColor" />
      <circle cx="15" cy="13.5" r="0.75" fill="currentColor" />
      <path d="M12 15l-1 1.5h2z" fill="currentColor" />
    </svg>
  {:else}
    {#if iconName === "bukalapak"}
      <!-- Bukalapak b outline lettermark SVG -->
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="custom-icon custom-bukalapak"
      >
        <path d="M7 4h3a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H7" />
        <path d="M7 12h4.5a4.5 4.5 0 0 1 4.5 4.5v0a4.5 4.5 0 0 1-4.5 4.5H7" />
        <path d="M7 4v17" />
      </svg>
    {:else}
      {#if iconName === "lazada"}
        <!-- Lazada heart-ribbon SVG -->
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="custom-icon custom-lazada"
        >
          <path d="M12 21L3 12a5 5 0 0 1 7-7l2 2 2-2a5 5 0 0 1 7 7z" />
          <path d="M12 7v14" />
          <path d="M10 9.5L12 12l2-2.5" />
        </svg>
      {:else}
        {#if iconName === "blibli"}
          <!-- Blibli smiling bag SVG -->
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="custom-icon custom-blibli"
          >
            <rect x="5" y="7" width="14" height="14" rx="3" />
            <path d="M9 7c0-2 1.5-3.5 3-3.5s3 1.5 3 3.5" />
            <circle cx="9.5" cy="12.5" r="0.75" fill="currentColor" />
            <circle cx="14.5" cy="12.5" r="0.75" fill="currentColor" />
            <path d="M10 15.5c.8 1 2.2 1 3 0" />
          </svg>
        {:else}
          <!-- Render Lucide Icon dynamically -->
          {@const LucideIcon = lucideMap[iconName] || ExternalLink}
          <LucideIcon {size} />
        {/if}
      {/if}
    {/if}
  {/if}
{/if}
