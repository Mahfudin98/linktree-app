<script lang="ts">
  import { authApi } from "$lib/api";
  import { goto } from "$app/navigation";

  let form = { email: "", password: "" };
  let loading = false;
  let serverError = "";

  async function handleSubmit(e: Event) {
    e.preventDefault();
    serverError = "";
    loading = true;

    try {
      const res = await authApi.login(form);

      if (!res.success) {
        serverError = res.message || "Invalid credentials";
        return;
      }

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
  <title>Sign In — LinkTree App</title>
  <meta name="description" content="Sign in to your LinkTree account." />
</svelte:head>

<div class="min-h-screen bg-stone-50 flex items-center justify-center p-8">
  <div class="w-full max-w-[420px] bg-white border-[1.5px] border-zinc-200 rounded-[20px] p-10">
    <div class="text-center mb-8">
      <a href="/" class="inline-block font-extrabold text-[1.1rem] text-zinc-900 no-underline tracking-tight mb-4">✦ LinkTree</a>
      <h1 class="text-2xl font-extrabold text-zinc-900 tracking-tight mb-1.5">Welcome back</h1>
      <p class="text-[0.875rem] text-zinc-500">Sign in to manage your links</p>
    </div>

    {#if serverError}
      <div class="bg-red-50 border border-red-200 text-red-600 rounded-xl py-3 px-4 text-[0.875rem] mb-5" role="alert">{serverError}</div>
    {/if}

    <form on:submit={handleSubmit} class="flex flex-col gap-4" novalidate>
      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-[0.82rem] font-semibold text-zinc-700">Email</label>
        <input
          id="email"
          type="email"
          bind:value={form.email}
          placeholder="you@example.com"
          autocomplete="email"
          class="py-3 px-3.5 border-[1.5px] border-zinc-200 rounded-xl text-[0.9rem] text-zinc-900 bg-stone-50 transition-colors outline-none w-full focus:border-zinc-900 focus:bg-white"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="password" class="text-[0.82rem] font-semibold text-zinc-700">Password</label>
        <input
          id="password"
          type="password"
          bind:value={form.password}
          placeholder="Your password"
          autocomplete="current-password"
          class="py-3 px-3.5 border-[1.5px] border-zinc-200 rounded-xl text-[0.9rem] text-zinc-900 bg-stone-50 transition-colors outline-none w-full focus:border-zinc-900 focus:bg-white"
        />
      </div>

      <button type="submit" class="flex items-center justify-center gap-2 p-3.5 bg-zinc-900 text-white border-none rounded-xl text-[0.95rem] font-semibold transition-all mt-2 cursor-pointer hover:not-disabled:bg-zinc-800 hover:not-disabled:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading} id="login-submit-btn">
        {#if loading}
          <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Signing in...
        {:else}
          Sign In
        {/if}
      </button>
    </form>

    <p class="text-center mt-6 text-[0.85rem] text-zinc-500">
      Don't have an account? <a href="/auth/register" class="text-zinc-900 font-semibold underline">Create one free</a>
    </p>
  </div>
</div>
