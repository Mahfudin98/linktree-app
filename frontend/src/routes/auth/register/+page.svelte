<script lang="ts">
  import { authApi } from "$lib/api";
  import { goto } from "$app/navigation";

  let form = { email: "", password: "", username: "", displayName: "" };
  let errors: Record<string, string> = {};
  let loading = false;
  let serverError = "";

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errors = {};
    serverError = "";
    loading = true;

    try {
      const res = await authApi.register(form);

      if (!res.success) {
        if (res.errors) {
          // Map field errors
          Object.entries(res.errors).forEach(([field, msgs]) => {
            errors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
          });
        } else {
          serverError = res.message;
        }
        return;
      }

      // Store token and redirect
      if (res.data?.token) {
        localStorage.setItem("lt_token", res.data.token);
        localStorage.setItem("lt_user", JSON.stringify(res.data.user));
      }

      await goto("/dashboard");
    } catch {
      serverError = "Something went wrong. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Create Account — LinkTree App</title>
  <meta name="description" content="Create your free LinkTree account and start sharing your links." />
</svelte:head>

<div class="min-h-screen bg-stone-50 flex items-center justify-center p-8">
  <div class="w-full max-w-[420px] bg-white border-[1.5px] border-zinc-200 rounded-[20px] p-10">
    <div class="text-center mb-8">
      <a href="/" class="inline-block font-extrabold text-[1.1rem] text-zinc-900 no-underline tracking-tight mb-4">✦ LinkTree</a>
      <h1 class="text-2xl font-extrabold text-zinc-900 tracking-tight mb-1.5">Create your account</h1>
      <p class="text-[0.875rem] text-zinc-500">Start sharing your links in minutes</p>
    </div>

    {#if serverError}
      <div class="bg-red-50 border border-red-200 text-red-600 rounded-xl py-3 px-4 text-[0.875rem] mb-5" role="alert">{serverError}</div>
    {/if}

    <form on:submit={handleSubmit} class="flex flex-col gap-4" novalidate>
      <div class="flex flex-col gap-1.5">
        <label for="displayName" class="text-[0.82rem] font-semibold text-zinc-700">Display Name</label>
        <input
          id="displayName"
          type="text"
          bind:value={form.displayName}
          placeholder="Your Name"
          autocomplete="name"
          class="py-3 px-3.5 border-[1.5px] {errors.displayName ? 'border-red-600' : 'border-zinc-200'} rounded-xl text-[0.9rem] text-zinc-900 bg-stone-50 transition-colors outline-none w-full focus:border-zinc-900 focus:bg-white"
        />
        {#if errors.displayName}<span class="text-[0.75rem] text-red-600">{errors.displayName}</span>{/if}
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="username" class="text-[0.82rem] font-semibold text-zinc-700">Username</label>
        <div class="flex border-[1.5px] {errors.username ? 'border-red-600' : 'border-zinc-200'} rounded-xl overflow-hidden bg-stone-50 transition-colors focus-within:border-zinc-900 focus-within:bg-white">
          <span class="px-3 py-3 bg-zinc-100 text-[0.82rem] text-zinc-500 whitespace-nowrap border-r-[1.5px] border-r-zinc-200 flex items-center">linktree.app/</span>
          <input
            id="username"
            type="text"
            bind:value={form.username}
            placeholder="yourname"
            autocomplete="username"
            class="flex-1 py-3 px-3.5 border-none rounded-none text-[0.9rem] text-zinc-900 bg-transparent outline-none w-full"
          />
        </div>
        {#if errors.username}<span class="text-[0.75rem] text-red-600">{errors.username}</span>{/if}
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-[0.82rem] font-semibold text-zinc-700">Email</label>
        <input
          id="email"
          type="email"
          bind:value={form.email}
          placeholder="you@example.com"
          autocomplete="email"
          class="py-3 px-3.5 border-[1.5px] {errors.email ? 'border-red-600' : 'border-zinc-200'} rounded-xl text-[0.9rem] text-zinc-900 bg-stone-50 transition-colors outline-none w-full focus:border-zinc-900 focus:bg-white"
        />
        {#if errors.email}<span class="text-[0.75rem] text-red-600">{errors.email}</span>{/if}
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="password" class="text-[0.82rem] font-semibold text-zinc-700">Password</label>
        <input
          id="password"
          type="password"
          bind:value={form.password}
          placeholder="Min. 8 characters"
          autocomplete="new-password"
          class="py-3 px-3.5 border-[1.5px] {errors.password ? 'border-red-600' : 'border-zinc-200'} rounded-xl text-[0.9rem] text-zinc-900 bg-stone-50 transition-colors outline-none w-full focus:border-zinc-900 focus:bg-white"
        />
        {#if errors.password}<span class="text-[0.75rem] text-red-600">{errors.password}</span>{/if}
      </div>

      <button type="submit" class="flex items-center justify-center gap-2 p-3.5 bg-zinc-900 text-white border-none rounded-xl text-[0.95rem] font-semibold transition-all mt-2 cursor-pointer hover:not-disabled:bg-zinc-800 hover:not-disabled:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading} id="register-submit-btn">
        {#if loading}
          <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating account...
        {:else}
          Create Account
        {/if}
      </button>
    </form>

    <p class="text-center mt-6 text-[0.85rem] text-zinc-500">
      Already have an account? <a href="/auth/login" class="text-zinc-900 font-semibold underline">Sign in</a>
    </p>
  </div>
</div>
