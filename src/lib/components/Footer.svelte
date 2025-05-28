<script lang="ts">
    // external profiles and links for the footer
    interface Social {
        name: string;
        url: string;
    }
    
    const socials: Social[] = [
      { name: 'Twitter',   url: 'https://twitter.com/YourHandle' },
      { name: 'Discord',   url: 'https://discord.gg/YourServer' },
      { name: 'GitHub',    url: 'https://github.com/YourRepo' }
    ];
</script>
  
<footer class="site-footer">
    <div class="links">
      {#each socials as { name, url }}
        <a href={url} target="_blank" rel="noopener">{name}</a>
      {/each}
    </div>
    <div class="legal">
      <a href="/terms">Terms of Service</a>
      <span>|</span>
      <a href="/privacy">Privacy Policy</a>
      <span>|</span>
      <a href="mailto:contact@musicchallenge.com">contact@musicchallenge.com</a>
    </div>
    <p class="copyright">
      &copy; {new Date().getFullYear()} Music Challenge
    </p>
</footer>
  
<style>
    .site-footer {
      padding: 2rem 1.5rem;
      background: #1e1e2f;
      color: #ccc;
      text-align: center;
      font-size: 0.9rem;
    }
  
    .site-footer .links a {
      margin: 0 0.5rem;
      color: #ff3e00;
      text-decoration: none;
    }
  
    .site-footer .links a:hover {
      text-decoration: underline;
    }
  
    .site-footer .legal {
      margin-top: 0.75rem;
    }
  
    .site-footer .legal a {
      margin: 0 0.25rem;
      color: #888;
      text-decoration: none;
    }
  
    .site-footer .legal span {
      margin: 0 0.25rem;
      color: #444;
    }
  
    .site-footer p {
      margin-top: 1rem;
      color: #666;
    }
</style>
