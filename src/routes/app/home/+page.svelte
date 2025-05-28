
<script>
    import { goto } from '$app/navigation';
    export let data; // { player }
  
    function startGame() {
      goto('/app/play');
    }
  </script>
  
  <section class="app-home">
    <h2>Welcome back, {data.player.name}!</h2>
    <p class="intro">
      Ready to test your music knowledge? Here’s how it works:
    </p>
  
    <ul class="rules">
      <li>
        <strong>1. Listen</strong><br />
        You get a 15-second preview of a track.
      </li>
      <li>
        <strong>2. Guess</strong><br />
        After the preview stops, type in the song title.
      </li>
      <li>
        <strong>3. Submit</strong><br />
        No timer—take your time and hit “Submit Guess.”
      </li>
      <li>
        <strong>4. Score</strong><br />
        +10 points if you’re correct, then press “Next” for the following round.
      </li>
      <li>
        <strong>5. Leaderboard</strong><br />
        Climb the rankings by racking up points!
      </li>
    </ul>
  
    <button class="start-btn" on:click={startGame}>
      Start Game ▶️
    </button>
  </section>
  
  <style>
    .app-home {
      max-width: 600px;
      margin: 3rem auto;
      padding: 1rem 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      text-align: center;
      font-family: sans-serif;
    }
    .app-home h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1e1e2f;
    }
    .app-home .intro {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 1.5rem;
    }
    .rules {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem;
      text-align: left;
    }
    .rules li {
      margin-bottom: 1rem;
      line-height: 1.4;
    }
    .rules strong {
      color: #ff3e00;
    }
    .start-btn {
      background: #ff3e00;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .start-btn:hover {
      opacity: 0.9;
    }
  </style>
  