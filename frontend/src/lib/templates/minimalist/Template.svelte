<script lang="ts">
  import type { ProfileData } from "$lib/types";
  import { ExternalLink } from "lucide-svelte";
  import CustomIcon from "$lib/components/CustomIcon.svelte";

  export let data: ProfileData;
</script>

<div class="min-h-screen bg-stone-50 flex items-start justify-center pt-12 px-4 pb-16 font-sans">
  <div class="w-full max-w-[480px] flex flex-col items-center gap-0">
    <!-- Avatar -->
    <div class="mb-5">
      {#if data.avatar}
        <img src={data.avatar} alt={data.name} class="w-[88px] h-[88px] rounded-full object-cover border-[3px] border-zinc-200" />
      {:else}
        <div class="w-[88px] h-[88px] rounded-full bg-zinc-900 text-white flex items-center justify-center text-3xl font-bold tracking-tight">
          {data.name.charAt(0).toUpperCase()}
        </div>
      {/if}
    </div>

    <!-- Header Info -->
    <h1 class="text-2xl font-bold text-zinc-900 tracking-tight m-0 mb-2 text-center">{data.name}</h1>
    {#if data.bio}
      <p class="text-[0.9rem] text-zinc-500 text-center leading-relaxed max-w-[340px] m-0 mb-6">{data.bio}</p>
    {/if}

    <!-- Social Links -->
    {#if data.socials && data.socials.length > 0}
      <div class="flex gap-3 mb-8">
        {#each data.socials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-600 bg-zinc-100 transition-all duration-200 no-underline hover:bg-zinc-900 hover:text-white hover:-translate-y-0.5"
            aria-label={social.platform}
          >
            <CustomIcon name={social.platform} size={18} />
          </a>
        {/each}
      </div>
    {/if}

    <!-- Links -->
    <div class="w-full flex flex-col gap-2.5">
      {#each data.links as link, i}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 py-4 px-5 bg-white border-[1.5px] border-zinc-200 rounded-xl no-underline text-zinc-900 font-medium text-[0.9rem] transition-all duration-200 animate-[slideUp_0.4s_ease_both] hover:border-zinc-900 hover:bg-zinc-900 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          style="animation-delay: {i * 60}ms"
        >
          <span class="flex items-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
            <CustomIcon name={link.icon} size={16} />
          </span>
          <span class="flex-1 text-center">{link.title}</span>
          <span class="flex items-center shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            <ExternalLink size={14} />
          </span>
        </a>
      {/each}
    </div>

    <footer class="mt-10 text-[0.75rem] text-zinc-400 tracking-wider">
      <span>@{data.username}</span>
    </footer>
  </div>
</div>

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
