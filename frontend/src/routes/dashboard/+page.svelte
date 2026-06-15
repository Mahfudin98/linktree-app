<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { profileApi } from "$lib/api";
  import { TEMPLATE_META } from "$lib/templates/index";
  import type { ProfileData, Link, SocialLink } from "$lib/types";

  let profile = $state<ProfileData | null>(null);
  let loading = $state(true);
  let saving = $state(false);
  let saveMessage = $state("");
  let activeTab = $state<"profile" | "links" | "template">("profile");

  // Form state
  let formName = $state("");
  let formBio = $state("");
  let formAvatar = $state("");
  let formTemplate = $state("minimalist");
  let formLinks = $state<Link[]>([]);
  let formSocials = $state<SocialLink[]>([]);

  $effect(() => {
    const token = localStorage.getItem("lt_token");
    if (!token) {
      goto("/auth/login");
      return;
    }

    profileApi
      .getOwn()
      .then((res) => {
        if (!res.success || !res.data) {
          goto("/auth/login");
          return;
        }
        profile = res.data;
        // Initialize form
        formName = profile.name;
        formBio = profile.bio ?? "";
        formAvatar = profile.avatar ?? "";
        formTemplate = profile.templateSlug;
        formLinks = [...profile.links];
        formSocials = [...profile.socials];
        loading = false;
      })
      .catch((err) => {
        console.error("[$effect Dashboard] Failed to fetch profile:", err);
        goto("/auth/login");
        loading = false;
      });
  });

  function addLink() {
    formLinks = [
      ...formLinks,
      {
        id: crypto.randomUUID(),
        title: "",
        url: "",
        icon: null,
        order: formLinks.length,
      },
    ];
  }

  function removeLink(index: number) {
    formLinks = formLinks.filter((_, i) => i !== index);
  }

  function addSocial() {
    formSocials = [
      ...formSocials,
      { id: crypto.randomUUID(), platform: "", url: "" },
    ];
  }

  function removeSocial(index: number) {
    formSocials = formSocials.filter((_, i) => i !== index);
  }

  async function saveProfile() {
    saving = true;
    saveMessage = "";

    try {
      const res = await profileApi.update({
        name: formName,
        bio: formBio || null,
        avatar: formAvatar || null,
        templateSlug: formTemplate,
        links: formLinks.map((l, i) => ({ ...l, order: i })),
        socials: formSocials,
      } as unknown as Partial<ProfileData>);

      if (res.success) {
        saveMessage = "✓ Saved successfully!";
        profile = res.data ?? profile;
        setTimeout(() => (saveMessage = ""), 3000);
      } else {
        saveMessage = `✗ ${res.message}`;
      }
    } catch {
      saveMessage = "✗ Failed to save";
    } finally {
      saving = false;
    }
  }

  function logout() {
    localStorage.removeItem("lt_token");
    localStorage.removeItem("lt_user");
    goto("/");
  }

  const ICON_OPTIONS = [
    "globe",
    "github",
    "twitter",
    "instagram",
    "youtube",
    "twitch",
    "linkedin",
    "mail",
    "terminal",
    "shopee",
    "tokopedia",
    "bukalapak",
    "lazada",
    "blibli",
    "tiktok_shop",
  ];
  const PLATFORM_OPTIONS = [
    "twitter",
    "instagram",
    "github",
    "linkedin",
    "youtube",
    "twitch",
    "tiktok",
    "discord",
    "shopee",
    "tokopedia",
    "bukalapak",
    "lazada",
    "blibli",
    "tiktok_shop",
  ];
</script>

<svelte:head>
  <title>Dashboard — LinkTree App</title>
</svelte:head>

<div class="flex flex-col md:flex-row min-h-screen font-sans bg-stone-50">
  <!-- Sidebar Nav -->
  <aside
    class="w-full md:w-[240px] shrink-0 bg-white border-b md:border-b-0 md:border-r border-zinc-200 flex flex-row md:flex-col p-4 md:p-6 md:sticky md:top-0 md:h-screen z-10 overflow-x-auto md:overflow-visible gap-2 md:gap-0 items-center md:items-stretch"
  >
    <a
      href="/"
      class="font-extrabold text-base text-zinc-900 no-underline tracking-tight md:px-3 py-2 md:mb-6 flex-shrink-0"
      >✦ LinkTree</a
    >

    <nav class="flex flex-row md:flex-col gap-1 flex-1 md:flex-none">
      <button
        class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-none bg-transparent text-sm font-medium transition-colors text-left whitespace-nowrap {activeTab ===
        'profile'
          ? 'bg-zinc-900 text-white'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
        on:click={() => (activeTab = "profile")}
        id="tab-profile"
      >
        <span class="text-base">👤</span> Profile
      </button>
      <button
        class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-none bg-transparent text-sm font-medium transition-colors text-left whitespace-nowrap {activeTab ===
        'links'
          ? 'bg-zinc-900 text-white'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
        on:click={() => (activeTab = "links")}
        id="tab-links"
      >
        <span class="text-base">🔗</span> Links
      </button>
      <button
        class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-none bg-transparent text-sm font-medium transition-colors text-left whitespace-nowrap {activeTab ===
        'template'
          ? 'bg-zinc-900 text-white'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'}"
        on:click={() => (activeTab = "template")}
        id="tab-template"
      >
        <span class="text-base">🎨</span> Template
      </button>
    </nav>

    <div class="flex flex-row md:flex-col gap-2 md:mt-auto">
      {#if profile}
        <a
          href="/{profile.username}"
          target="_blank"
          class="block p-2.5 text-center text-[0.8rem] font-semibold text-zinc-700 bg-zinc-100 rounded-xl no-underline transition-colors hover:bg-zinc-200 whitespace-nowrap"
          id="view-public-btn"
        >
          View Public Page ↗
        </a>
      {/if}
      <button
        class="p-2.5 bg-transparent border-[1.5px] border-red-200 text-red-600 rounded-xl text-[0.8rem] font-semibold transition-colors cursor-pointer hover:bg-red-50 whitespace-nowrap"
        on:click={logout}
        id="logout-btn">Sign Out</button
      >
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-6 md:p-8 lg:p-10 max-w-[760px] mx-auto w-full">
    {#if loading}
      <div class="flex items-center justify-center h-[200px]">
        <div
          class="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"
        ></div>
      </div>
    {:else}
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 class="text-2xl font-extrabold text-zinc-900 tracking-tight">
          {activeTab === "profile"
            ? "Edit Profile"
            : activeTab === "links"
              ? "Manage Links"
              : "Choose Template"}
        </h1>
        <div class="flex items-center gap-3.5">
          {#if saveMessage}
            <span
              class="text-[0.82rem] font-medium {saveMessage.startsWith('✓')
                ? 'text-green-600'
                : 'text-red-600'}">{saveMessage}</span
            >
          {/if}
          <button
            class="px-5 py-2.5 bg-zinc-900 text-white border-none rounded-xl text-[0.875rem] font-semibold cursor-pointer transition-colors hover:not-disabled:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={saveProfile}
            disabled={saving}
            id="save-profile-btn"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <!-- ── Profile Tab ── -->
      {#if activeTab === "profile"}
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label
              for="dash-name"
              class="text-[0.82rem] font-semibold text-zinc-700"
              >Display Name</label
            >
            <input
              id="dash-name"
              type="text"
              bind:value={formName}
              placeholder="Your Name"
              class="p-3 border-[1.5px] border-zinc-200 rounded-xl text-[0.875rem] text-zinc-900 bg-white outline-none transition-colors focus:border-zinc-900 w-full"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              for="dash-bio"
              class="text-[0.82rem] font-semibold text-zinc-700">Bio</label
            >
            <textarea
              id="dash-bio"
              bind:value={formBio}
              placeholder="Tell the world about yourself..."
              rows="3"
              class="p-3 border-[1.5px] border-zinc-200 rounded-xl text-[0.875rem] text-zinc-900 bg-white outline-none transition-colors focus:border-zinc-900 w-full resize-y min-h-[80px]"
            ></textarea>
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              for="dash-avatar"
              class="text-[0.82rem] font-semibold text-zinc-700"
              >Avatar URL</label
            >
            <input
              id="dash-avatar"
              type="url"
              bind:value={formAvatar}
              placeholder="https://..."
              class="p-3 border-[1.5px] border-zinc-200 rounded-xl text-[0.875rem] text-zinc-900 bg-white outline-none transition-colors focus:border-zinc-900 w-full"
            />
            {#if formAvatar}
              <img
                src={formAvatar}
                alt="Avatar preview"
                class="w-[60px] h-[60px] rounded-full object-cover border-2 border-zinc-200 mt-2"
              />
            {/if}
          </div>

          <!-- Social Links -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-zinc-900">Social Links</h3>
              <button
                class="px-4 py-2 bg-zinc-100 border-[1.5px] border-zinc-200 rounded-lg text-[0.82rem] font-semibold text-zinc-700 cursor-pointer transition-colors hover:bg-zinc-200"
                on:click={addSocial}
                id="add-social-btn">+ Add Social</button
              >
            </div>
            {#each formSocials as social, i}
              <div class="flex gap-2 items-center">
                <select
                  bind:value={social.platform}
                  class="p-3 border-[1.5px] border-zinc-200 rounded-xl text-[0.875rem] text-zinc-900 bg-white outline-none transition-colors focus:border-zinc-900 cursor-pointer w-auto"
                >
                  <option value="">Platform...</option>
                  {#each PLATFORM_OPTIONS as p}
                    <option value={p}>{p}</option>
                  {/each}
                </select>
                <input
                  type="url"
                  bind:value={social.url}
                  placeholder="https://..."
                  class="flex-1 p-3 border-[1.5px] border-zinc-200 rounded-xl text-[0.875rem] text-zinc-900 bg-white outline-none transition-colors focus:border-zinc-900"
                />
                <button
                  class="p-2.5 bg-transparent border-[1.5px] border-red-200 text-red-600 rounded-lg text-[0.75rem] cursor-pointer shrink-0 transition-colors hover:bg-red-50"
                  on:click={() => removeSocial(i)}>✕</button
                >
              </div>
            {/each}
          </div>
        </div>

        <!-- ── Links Tab ── -->
      {:else if activeTab === "links"}
        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-zinc-900">Your Links</h3>
            <button
              class="px-4 py-2 bg-zinc-100 border-[1.5px] border-zinc-200 rounded-lg text-[0.82rem] font-semibold text-zinc-700 cursor-pointer transition-colors hover:bg-zinc-200"
              on:click={addLink}
              id="add-link-btn">+ Add Link</button
            >
          </div>
          {#if formLinks.length === 0}
            <div class="text-center p-8 text-zinc-400 text-[0.875rem]">
              <p>No links yet. Add your first link!</p>
            </div>
          {/if}
          {#each formLinks as link, i}
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white border-[1.5px] border-zinc-200 rounded-xl"
            >
              <span
                class="text-[0.75rem] font-bold text-zinc-400 min-w-[20px] pt-2 sm:pt-0"
                >{i + 1}</span
              >
              <div
                class="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 w-full"
              >
                <input
                  type="text"
                  bind:value={link.title}
                  placeholder="Link title"
                  class="p-2.5 border-[1.5px] border-zinc-200 rounded-lg text-[0.875rem] text-zinc-900 bg-white outline-none focus:border-zinc-900 w-full"
                />
                <input
                  type="url"
                  bind:value={link.url}
                  placeholder="https://..."
                  class="p-2.5 border-[1.5px] border-zinc-200 rounded-lg text-[0.875rem] text-zinc-900 bg-white outline-none focus:border-zinc-900 w-full"
                />
                <select
                  bind:value={link.icon}
                  class="p-2.5 border-[1.5px] border-zinc-200 rounded-lg text-[0.875rem] text-zinc-900 bg-white outline-none focus:border-zinc-900 cursor-pointer w-full sm:max-w-[120px]"
                >
                  <option value="">Icon...</option>
                  {#each ICON_OPTIONS as icon}
                    <option value={icon}>{icon}</option>
                  {/each}
                </select>
              </div>
              <button
                class="p-2 bg-transparent border-[1.5px] border-red-200 text-red-600 rounded-lg text-[0.75rem] cursor-pointer shrink-0 hover:bg-red-50 self-end sm:self-auto"
                on:click={() => removeLink(i)}>✕</button
              >
            </div>
          {/each}
        </div>

        <!-- ── Template Tab ── -->
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {#each TEMPLATE_META as tmpl}
            <button
              class="border-2 rounded-2xl overflow-hidden cursor-pointer bg-transparent text-left transition-all p-0 focus:outline-none {formTemplate ===
              tmpl.slug
                ? 'border-zinc-900 ring-2 ring-zinc-900/10'
                : 'border-zinc-200 hover:border-zinc-400 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'}"
              on:click={() => (formTemplate = tmpl.slug)}
              id="template-option-{tmpl.slug}"
            >
              <div
                class="h-[130px] flex flex-col items-center justify-center gap-2 p-4 {tmpl.slug ===
                'minimalist'
                  ? 'bg-stone-50'
                  : tmpl.slug === 'glassmorphism'
                    ? 'bg-gradient-to-br from-[#0f0c29] to-[#302b63]'
                    : 'bg-[#050a0e]'}"
              >
                <div
                  class="w-8 h-8 rounded-full {tmpl.slug === 'minimalist'
                    ? 'bg-zinc-900'
                    : tmpl.slug === 'glassmorphism'
                      ? 'bg-gradient-to-br from-violet-600 to-pink-600'
                      : 'bg-[#0a1628] border-[1.5px] border-cyan-400 rounded-[3px]'}"
                ></div>
                <div class="flex flex-col items-center gap-1 w-full">
                  <div
                    class="h-1.5 rounded-[3px] w-[60%] {tmpl.slug ===
                    'minimalist'
                      ? 'bg-zinc-200'
                      : tmpl.slug === 'glassmorphism'
                        ? 'bg-white/25'
                        : 'bg-cyan-400/35'}"
                  ></div>
                  <div
                    class="h-1.5 rounded-[3px] w-[45%] opacity-60 {tmpl.slug ===
                    'minimalist'
                      ? 'bg-zinc-200'
                      : tmpl.slug === 'glassmorphism'
                        ? 'bg-white/25'
                        : 'bg-cyan-400/35'}"
                  ></div>
                  <div
                    class="h-[18px] rounded-md w-full mt-1 {tmpl.slug ===
                    'minimalist'
                      ? 'bg-white border border-zinc-200'
                      : tmpl.slug === 'glassmorphism'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-cyan-400/5 border border-cyan-400/20 border-l-2 border-l-cyan-400 rounded-sm'}"
                  ></div>
                  <div
                    class="h-[18px] rounded-md w-full mt-0.5 {tmpl.slug ===
                    'minimalist'
                      ? 'bg-white border border-zinc-200'
                      : tmpl.slug === 'glassmorphism'
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-cyan-400/5 border border-cyan-400/20 border-l-2 border-l-cyan-400 rounded-sm'}"
                  ></div>
                </div>
              </div>
              <div class="flex items-center justify-between px-3.5 pt-3 pb-1">
                <span class="text-[0.875rem] font-bold text-zinc-900"
                  >{tmpl.name}</span
                >
                {#if formTemplate === tmpl.slug}
                  <span
                    class="text-[0.7rem] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
                    >✓ Active</span
                  >
                {/if}
              </div>
              <p
                class="text-[0.75rem] text-zinc-500 px-3.5 pb-3.5 leading-relaxed"
              >
                {tmpl.description}
              </p>
            </button>
          {/each}
        </div>
      {/if}
    {/if}
  </main>
</div>
