<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  let records = [];
  let intervalId;

  // Load the leaderboard data from the page data
  export let data;
  
  $: if (data && data.leaderboard) {
    records = data.leaderboard;
  }
  
  // Backup method to fetch leaderboard data if needed
  async function loadLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        records = await res.json();
      } else {
        console.error('Leaderboard fetch failed:', res.status);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  }

  onMount(() => {
    // initial load
    loadLeaderboard();
    // re-load every 5 seconds
    intervalId = setInterval(loadLeaderboard, 5000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<section class="leaderboard-card">
  <h1>Leaderboard</h1>

  <table class="leaderboard-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Country</th>
        <th>Gender</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {#each records as r, i}
        <tr class={i % 2 === 0 ? 'even' : 'odd'}>
          <td>{i + 1}</td>
          <td>{r.name}</td>
          <td>{r.country}</td>
          <td>{r.gender}</td>
          <td>{r.score}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- Removed duplicate logout button -->
</section>

<style>
  .leaderboard-card {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    font-family: sans-serif;
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 0.6rem 0.8rem;
    border: 1px solid #ddd;
    text-align: left;
  }

  .leaderboard-table thead {
    background: #1e1e2f;
    color: #fff;
  }

  .leaderboard-table tbody tr.even {
    background: #f9f9f9;
  }

  .leaderboard-table tbody tr.odd {
    background: #fff;
  }

  .logout-form {
    text-align: right;
    margin-top: 1rem;
  }

  .logout-form button {
    background: #ff3e00;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .logout-form button:hover {
    background: #e03600;
  }
</style>
