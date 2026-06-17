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
    ShoppingBag,
    Phone,
    MessageCircle,
  } from "lucide-svelte";
  import type { ComponentType } from "svelte";
  import TokopediaOwl from "$lib/assets/tokped.png";
  import Shopee from "$lib/assets/shopee.svg";
  import Lazada from "$lib/assets/lazada.jpeg";
  import Blibli from "$lib/assets/blibli.png";
  import TiktokShop from "$lib/assets/tiktok-circle-icon.svg";
  import Tiktok from "$lib/assets/tiktok-simplified-black-icon.svg";

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
    phone: Phone,
    message: MessageCircle,
    shoppingbag: ShoppingBag,
  };
</script>

{#if iconName === "shopee"}
  <!-- Shopee Custom Premium Outline SVG -->
  <img
    src={Shopee}
    alt=""
    class="custom-icon custom-shopee"
    width={size}
    height={size}
  />
{:else if iconName === "tokopedia"}
  <!-- Tokopedia Owl Bag SVG -->
  <img
    src={TokopediaOwl}
    alt=""
    class="custom-icon custom-tokopedia"
    width={size}
    height={size}
  />
{:else if iconName === "bukalapak"}
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
{:else if iconName === "lazada"}
  <!-- Lazada heart-ribbon SVG -->
  <img
    src={Lazada}
    alt=""
    class="custom-icon custom-lazada"
    width={size}
    height={size}
  />
{:else if iconName === "blibli"}
  <!-- Blibli smiling bag SVG -->
  <img
    src={Blibli}
    alt=""
    class="custom-icon custom-blibli"
    width={size}
    height={size}
  />
{:else if iconName === "tiktok_shop"}
  <!-- tiktokshop smiling bag SVG -->
  <img
    src={TiktokShop}
    alt=""
    class="custom-icon custom-tiktokshop"
    width={size}
    height={size}
  />
{:else if iconName === "tiktok"}
  <!-- tiktokshop smiling bag SVG -->
  <img
    src={Tiktok}
    alt=""
    class="custom-icon custom-tiktok hover:invert"
    width={size}
    height={size}
  />
{:else}
  <!-- Render Lucide Icon dynamically -->
  {@const LucideIcon = lucideMap[iconName] || ExternalLink}
  <LucideIcon {size} />
{/if}
