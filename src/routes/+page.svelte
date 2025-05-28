<script lang="ts">
    import { goto } from '$app/navigation';
</script>
  
<section class="landing">
    <h1>🎵 Music Challenge</h1>
    <p>Welcome! Test your music knowledge by guessing tracks from short previews.</p>
    <button on:click={() => goto('/profile')}>Sign In / Register</button>
</section>
  
<style>
    .landing {
      max-width: 600px;
      margin: 5rem auto;
      text-align: center;
      padding: 2rem;
    }
    .landing h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .landing p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    .landing button {
      padding: 0.75rem 1.5rem;
      background: #ff3e00;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .landing button:hover {
      opacity: 0.9;
    }
</style>
