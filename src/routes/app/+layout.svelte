<script lang="ts">
    import { page } from '$app/stores';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>
  
<Header user={data.player} />

<main class="content">
    <slot />
</main>

<Footer />
  
<style>
    .content {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
</style>
