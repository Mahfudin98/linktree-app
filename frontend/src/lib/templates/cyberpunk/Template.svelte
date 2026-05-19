<script lang="ts">
  import type { ProfileData } from "$lib/types";
  import { ExternalLink } from "lucide-svelte";
  import CustomIcon from "$lib/components/CustomIcon.svelte";

  export let data: ProfileData;

  // Glitch text animation helper
  let hovered: string | null = null;
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-[#050a0e] flex items-start justify-center pt-8 px-4 pb-16 font-['Share_Tech_Mono',_monospace] relative overflow-hidden">
  <!-- Scanlines overlay -->
  <div class="fixed inset-0 pointer-events-none z-0" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.015) 2px, rgba(0, 255, 255, 0.015) 4px)" aria-hidden="true"></div>

  <!-- Grid background -->
  <div class="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" aria-hidden="true"></div>

  <div class="w-full max-w-[520px] flex flex-col items-center relative z-10">
    <!-- System status bar -->
    <div class="flex items-center justify-between gap-2 bg-cyan-400/5 border border-cyan-400/20 rounded px-3.5 py-1.5 mb-8 text-[0.65rem] text-cyan-400 tracking-widest w-full">
      <span class="w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_6px_#00ff41] animate-[pulse_2s_ease_infinite] shrink-0"></span>
      <span class="flex-1 text-center">SYS_ONLINE // LINK_TREE v2.0</span>
      <span class="text-cyan-400/50">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
    </div>

    <!-- Avatar -->
    <div class="relative w-24 h-24 mb-6">
      {#if data.avatar}
        <img src={data.avatar} alt={data.name} class="w-24 h-24 rounded object-cover saturate-0 brightness-110 contrast-110 mix-blend-screen relative z-10" />
      {:else}
        <div class="w-24 h-24 rounded bg-[#0a1628] text-cyan-400 flex items-center justify-center text-[2.5rem] font-['Orbitron'] font-black drop-shadow-[0_0_20px_#00ffff] relative z-10">
          {data.name.charAt(0).toUpperCase()}
        </div>
      {/if}
      <div class="absolute -inset-[3px] border-2 border-cyan-400 rounded z-0 shadow-[0_0_15px_rgba(0,255,255,0.4),inset_0_0_15px_rgba(0,255,255,0.05)]"></div>
      <div class="absolute -inset-[3px] border-2 border-[#ff0080] rounded z-0 opacity-40 animate-[glitchShift_4s_steps(1)_infinite]" aria-hidden="true"></div>
    </div>

    <!-- Header -->
    <div class="flex items-baseline gap-2 mb-3">
      <span class="text-[0.7rem] text-[#ff0080] tracking-widest">IDENT://</span>
      <h1 class="font-['Orbitron'] text-2xl font-black text-cyan-400 tracking-wider m-0 uppercase drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">{data.name}</h1>
    </div>

    {#if data.bio}
      <p class="text-[0.8rem] text-[#00ff41]/75 text-center leading-[1.6] max-w-[380px] m-0 mb-6">
        <span class="text-[#00ff41]">&gt; </span>{data.bio}
        <span class="inline-block animate-[blink_1s_step-start_infinite] text-cyan-400">_</span>
      </p>
    {/if}

    <!-- Socials -->
    {#if data.socials && data.socials.length > 0}
      <div class="flex gap-2 mb-7">
        {#each data.socials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center w-8 h-8 rounded-sm text-cyan-400/60 bg-cyan-400/5 border border-cyan-400/20 no-underline transition-all duration-150 hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            aria-label={social.platform}
          >
            <CustomIcon name={social.platform} size={15} />
          </a>
        {/each}
      </div>
    {/if}

    <!-- Links -->
    <div class="w-full flex flex-col gap-2">
      {#each data.links as link, i}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-3 py-3.5 px-4 bg-cyan-400/5 border border-cyan-400/15 border-l-[3px] border-l-cyan-400 rounded-sm no-underline text-cyan-400/80 text-[0.82rem] tracking-wider transition-all duration-150 animate-[cyberSlide_0.4s_ease_both] relative overflow-hidden hover:bg-cyan-400/10 hover:border-cyan-400 hover:border-l-[#ff0080] hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.1),inset_0_0_20px_rgba(0,255,255,0.02)] hover:translate-x-1"
          style="animation-delay: {i * 90}ms"
          on:mouseenter={() => hovered = link.id}
          on:mouseleave={() => hovered = null}
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-[100%] transition-transform duration-400 group-hover:translate-x-[100%]"></div>
          <span class="text-[#ff0080] text-[0.7rem] shrink-0 min-w-[30px]">[{String(i + 1).padStart(2, "0")}]</span>
          <span class="flex items-center shrink-0 opacity-60">
            <CustomIcon name={link.icon} size={15} />
          </span>
          <span class="flex-1 uppercase tracking-[0.08em]">{link.title}</span>
          <span class="text-[0.65rem] text-[#ff0080] opacity-0 -translate-x-2 transition-all duration-150 shrink-0 group-hover:opacity-100 group-hover:translate-x-0">EXECUTE &gt;&gt;</span>
        </a>
      {/each}
    </div>

    <!-- Footer terminal -->
    <div class="mt-10 text-[0.7rem] text-[#00ff41]/40 tracking-wider">
      <span class="text-[#00ff41]/60">root@{data.username}:~$</span>
      <span class="text-cyan-400/40"> linktree --list --all</span>
    </div>
  </div>
</div>

<style>
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes glitchShift {
    0%, 95%, 100% { clip-path: inset(100%); transform: none; }
    96% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 2px); }
    98% { clip-path: inset(60% 0 20% 0); transform: translate(3px, -2px); }
  }

  @keyframes blink {
    50% { opacity: 0; }
  }

  @keyframes cyberSlide {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
</style>
