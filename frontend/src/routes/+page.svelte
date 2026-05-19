<script lang="ts">
  import { TEMPLATE_META } from "$lib/templates/index";
</script>

<svelte:head>
  <title>LinkTree App — Create Your Linktree</title>
  <meta
    name="description"
    content="Create your beautiful linktree with stunning templates. Share all your links in one place."
  />
</svelte:head>

<main class="min-h-screen bg-stone-50">
  <!-- Hero -->
  <section class="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-medium text-zinc-500 mb-6 tracking-wide">
      ✦ Open Source · Self-Hostable
    </div>
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-zinc-900 mb-5">
      Your Links,<br />
      <span class="bg-gradient-to-br from-violet-600 to-pink-600 bg-clip-text text-transparent">Beautifully Displayed</span>
    </h1>
    <p class="text-[1.1rem] text-zinc-500 leading-relaxed max-w-lg mb-8">
      Create your personal link page with stunning templates.
      Share everything you create, curate and sell with one link.
    </p>
    <div class="flex flex-wrap justify-center gap-3.5">
      <a href="/auth/register" class="px-8 py-3.5 bg-zinc-900 text-white rounded-xl font-semibold text-[0.95rem] transition-all hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.15)]" id="get-started-btn">Get Started — It's Free</a>
      <a href="/demo" class="px-8 py-3.5 bg-transparent text-zinc-700 rounded-xl font-semibold text-[0.95rem] border-[1.5px] border-zinc-200 transition-all hover:border-zinc-400 hover:bg-zinc-100" id="view-demo-btn">View Demo</a>
    </div>
  </section>

  <!-- Templates Preview -->
  <section class="px-6 py-8 pb-20 max-w-6xl mx-auto text-center">
    <h2 class="text-3xl font-extrabold tracking-tight text-zinc-900 mb-3">Choose Your Style</h2>
    <p class="text-zinc-500 mb-12 text-base">
      Three distinct templates, with more coming. Each is fully customizable.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each TEMPLATE_META as template}
        <a href="/{template.slug === 'minimalist' ? 'demo' : template.slug === 'glassmorphism' ? 'glassuser' : 'cyberpunk'}" class="rounded-[20px] overflow-hidden text-inherit border-[1.5px] border-zinc-200 bg-white transition-all duration-300 flex flex-col hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:border-zinc-300" id="template-{template.slug}">
          <div class="h-[200px] p-8 flex flex-col items-center gap-2 {template.slug === 'minimalist' ? 'bg-stone-50' : template.slug === 'glassmorphism' ? 'bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]' : 'bg-[#050a0e]'} relative">
            {#if template.slug === 'cyberpunk'}
              <div class="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            {/if}
            <div class="w-10 h-10 rounded-full z-10 {template.slug === 'minimalist' ? 'bg-zinc-900' : template.slug === 'glassmorphism' ? 'bg-gradient-to-br from-violet-600 to-pink-600 shadow-[0_0_10px_rgba(124,58,237,0.4)]' : 'bg-[#0a1628] border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)] rounded-md'}"></div>
            <div class="h-2.5 rounded z-10 my-1 w-20 {template.slug === 'minimalist' ? 'bg-zinc-200' : template.slug === 'glassmorphism' ? 'bg-white/20' : 'bg-cyan-400/30'}"></div>
            <div class="flex flex-col gap-1.5 w-full z-10">
              {#each [1,2,3] as _}
                <div class="h-7 rounded-lg {template.slug === 'minimalist' ? 'bg-white border-[1.5px] border-zinc-200' : template.slug === 'glassmorphism' ? 'bg-white/5 border border-white/10 rounded-xl' : 'bg-cyan-400/5 border border-cyan-400/20 border-l-2 border-l-cyan-400 rounded-sm'}"></div>
              {/each}
            </div>
          </div>
          <div class="p-5 pb-6 text-left">
            <h3 class="text-base font-bold text-zinc-900 mb-1.5">{template.name}</h3>
            <p class="text-[0.82rem] text-zinc-500 leading-relaxed">{template.description}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
</main>
