<script lang="ts">
    import { page } from '$app/stores';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    // Only show header and footer on the root route
    // App routes will have their own layout
    $: isRootRoute = $page.url.pathname === '/';
    
    // Hide sign in/register when user is logged in
    $: isLoggedIn = !!data.player;
</script>
  
{#if isRootRoute}
  <Header user={data.player} hideAuth={isLoggedIn} />

  <main>
      <slot />
  </main>

  <Footer />
{:else}
  <slot />
{/if}
  
<style>
    main {
        max-width: 600px;
        padding: 2rem;
        margin: 0 auto;
        font-family: sans-serif;
    }
</style>
