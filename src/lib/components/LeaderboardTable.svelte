<script>
    /** 
     * Expects `scores` to be an array of objects:
     * [{ rank, name, score, date }, …]
     */
    export let scores = [];
  </script>
  
  <table class="leaderboard-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Player</th>
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each scores as { rank, name, score, date }}
        <tr>
          <td>{rank}</td>
          <td>{name}</td>
          <td>{score}</td>
          <td>{new Date(date).toLocaleDateString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  
  <style>
    .leaderboard-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    .leaderboard-table th,
    .leaderboard-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
      text-align: left;
    }
    .leaderboard-table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .leaderboard-table tr:hover {
      background: #fafafa;
    }
  </style>
  