<script lang="ts">
  import type { ProfileData } from "$lib/types";
  import { ExternalLink } from "lucide-svelte";
  import CustomIcon from "$lib/components/CustomIcon.svelte";

  export let data: ProfileData;
</script>

<div
  class="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-start justify-center pt-12 px-4 pb-16 font-sans relative overflow-hidden"
>
  <!-- Animated background blobs -->
  <div
    class="fixed rounded-full blur-[80px] opacity-40 animate-[blobFloat_8s_ease-in-out_infinite] pointer-events-none z-0 w-[400px] h-[400px] bg-[radial-gradient(circle,#7c3aed,transparent)] -top-[100px] -left-[100px]"
    aria-hidden="true"
  ></div>
  <div
    class="fixed rounded-full blur-[80px] opacity-40 animate-[blobFloat_8s_ease-in-out_infinite] pointer-events-none z-0 w-[350px] h-[350px] bg-[radial-gradient(circle,#db2777,transparent)] top-[30%] -right-[80px]"
    style="animation-delay:-3s"
    aria-hidden="true"
  ></div>
  <div
    class="fixed rounded-full blur-[80px] opacity-40 animate-[blobFloat_8s_ease-in-out_infinite] pointer-events-none z-0 w-[300px] h-[300px] bg-[radial-gradient(circle,#0891b2,transparent)] -bottom-[50px] left-[30%]"
    style="animation-delay:-5s"
    aria-hidden="true"
  ></div>

  <div class="w-full max-w-[480px] flex flex-col items-center relative z-10">
    <!-- Avatar -->
    <div class="relative mb-6">
      {#if data.avatar}
        <img
          src={data.avatar}
          alt={data.name}
          class="w-[92px] h-[92px] rounded-full object-cover relative z-10 border-[3px] border-white/30"
        />
      {:else}
        <div
          class="w-[92px] h-[92px] rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-white flex items-center justify-center text-[2rem] font-bold relative z-10"
        >
          {data.name.charAt(0).toUpperCase()}
        </div>
      {/if}
      <div
        class="absolute -inset-1.5 rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-cyan-600 z-0 animate-[spinRing_4s_linear_infinite]"
      ></div>
    </div>

    <!-- Header -->
    <h1
      class="text-[1.6rem] font-extrabold text-white tracking-tight m-0 mb-2 text-center drop-shadow-[0_2px_20px_rgba(124,58,237,0.5)]"
    >
      {data.name}
    </h1>
    {#if data.bio}
      <p
        class="text-[0.875rem] text-white/65 text-center leading-[1.65] max-w-[340px] m-0 mb-6"
      >
        {data.bio}
      </p>
    {/if}

    <!-- Socials -->
    {#if data.socials && data.socials.length > 0}
      <div class="flex gap-2.5 mb-8">
        {#each data.socials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center w-[34px] h-[34px] rounded-lg text-white/70 bg-white/10 backdrop-blur-md border border-white/10 no-underline transition-all duration-200 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(124,58,237,0.4)]"
            aria-label={social.platform}
            data-umami-event={`(${data.username})-click_social_${social.platform.replace(/ /g, "_")}`}
            data-umami-event-platform={social.platform}
            data-umami-event-url={social.url}
          >
            <CustomIcon name={social.platform} size={16} />
          </a>
        {/each}
      </div>
    {/if}

    <!-- Links -->
    <div class="w-full flex flex-col gap-3">
      {#each data.links as link, i}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 py-4 px-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl no-underline text-white/90 font-medium text-[0.9rem] transition-all duration-300 animate-[fadeInUp_0.5s_ease_both] relative overflow-hidden hover:border-violet-600/50 hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(124,58,237,0.25),0_0_0_1px_rgba(124,58,237,0.3)] hover:text-white"
          style="animation-delay: {i * 80}ms"
          data-umami-event={`(${data.username})-click_link_${link.title.replace(/ /g, "_")}`}
          data-umami-event-title={link.title}
          data-umami-event-url={link.url}
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-violet-600/15 to-pink-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
          <span class="flex items-center shrink-0 opacity-70 relative z-10">
            <CustomIcon name={link.icon} size={16} />
          </span>
          <span class="flex-1 text-center relative z-10">{link.title}</span>
          <span
            class="flex items-center shrink-0 opacity-40 relative z-10 transition-all duration-200 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <ExternalLink size={13} />
          </span>
        </a>
      {/each}
    </div>

    <footer class="mt-10">
      <span class="text-[0.75rem] text-white/30 tracking-[0.1em]"
        >✦ @{data.username}</span
      >
    </footer>
  </div>
</div>

<style>
  @keyframes blobFloat {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(20px, -20px) scale(1.05);
    }
    66% {
      transform: translate(-15px, 15px) scale(0.95);
    }
  }

  @keyframes spinRing {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
