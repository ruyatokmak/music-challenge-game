<script context="module">
  import { redirect } from '@sveltejs/kit';
  export function load({ locals }) {
    if (!locals.player) throw redirect(302, '/profile');
  }
</script>

<script>
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';

  const ARTISTS = [
    'Coldplay', 'Ed Sheeran', 'Billie Eilish',
    'Dua Lipa', 'Justin Bieber', 'The Weeknd',
    'Alan Walker', 'Akon', 'Martin Garrix'
  ];

  let pool = [];
  let round = 0;
  let score = 0;
  let phase = 'loading';   // 'loading'|'preview'|'guess'|'result'|'finished'|'error'
  let track = null;
  let guess = '';
  let result = '';
  let audioEl;
  let previewTimer;
  let countdown = 0;
  let countdownInterval;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  async function fetchPool() {
    phase = 'loading';
    pool = [];

    try {
      for (let i = 0; i < ARTISTS.length; i++) {
        const limit = i === 0 ? 2 : 1;
        const res = await fetch('https://itunes.apple.com/search?' +
          new URLSearchParams({
            term: ARTISTS[i],
            media: 'music',
            limit: String(limit),
            country: 'US',
            explicit: 'No'
          })
        );
        const { results } = await res.json();
        results.forEach(r => {
          if (r.previewUrl) {
            pool.push({
              title: r.trackName,
              artist: r.artistName,
              previewUrl: r.previewUrl
            });
          }
        });
      }
      shuffle(pool);
      round = 0;
      score = 0;
      startRound();
    } catch (e) {
      console.error(e);
      phase = 'error';
    }
  }

  async function startRound() {
    clearTimeout(previewTimer);
    clearInterval(countdownInterval);
    guess = '';
    result = '';

    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }

    if (round >= 10 || pool.length === 0) {
      phase = 'finished';
      await saveScore();
      return;
    }

    track = pool[round++];
    phase = 'preview';

    await tick();
    audioEl.load();

    countdown = 15;
    countdownInterval = setInterval(() => {
      if (countdown > 0) countdown--;
    }, 1000);

    try {
      await audioEl.play();
    } catch {}

    previewTimer = setTimeout(() => {
      clearInterval(countdownInterval);
      audioEl.pause();
      phase = 'guess';
    }, 15000);
  }

  function replaySnippet() {
    clearTimeout(previewTimer);
    clearInterval(countdownInterval);
    countdown = 15;
    phase = 'preview';

    audioEl.currentTime = 0;
    audioEl.play();

    countdownInterval = setInterval(() => {
      if (countdown > 0) countdown--;
    }, 1000);

    previewTimer = setTimeout(() => {
      clearInterval(countdownInterval);
      audioEl.pause();
      phase = 'guess';
    }, 15000);
  }

  function submitGuess() {
    if (phase !== 'guess') return;
    const correct = guess.trim().toLowerCase() === track.title.trim().toLowerCase();
    if (correct) score += 10;
    result = correct ? 'correct' : 'wrong';
    phase = 'result';
  }

  async function saveScore() {
    await fetch('/app/api/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ total: score })
    });
  }

  async function endGame() {
    clearTimeout(previewTimer);
    clearInterval(countdownInterval);
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    phase = 'finished';
    await saveScore();
    goto('/app/leaderboard');
  }

  function nextRound() {
    startRound();
  }

  onMount(fetchPool);
</script>

<section class="card">
  <header>
    <div>Round {Math.min(round,10)} / 10</div>
    <div>Score: {score}</div>
    <button class="end-game" on:click={endGame}>End Game</button>
  </header>

  {#if phase === 'loading'}
    <p class="center">Loading songs…</p>
    <button class="center" on:click={fetchPool}>🔄 Retry</button>

  {:else if phase === 'error'}
    <p class="center error">❌ Couldn’t load. Check network.</p>
    <button class="center" on:click={fetchPool}>🔄 Retry</button>

  {:else if phase === 'preview'}
    <p class="center"><strong>Artist:</strong> {track.artist}</p>
    <div class="progress-bar">
      <div class="fill" style="width:{(countdown/15)*100}%"></div>
    </div>
    <p class="countdown center">{countdown}s remaining</p>
    <audio bind:this={audioEl} src={track.previewUrl} preload="auto" class="hidden" />
    <div class="controls">
      <button on:click={replaySnippet}>▶️ Replay</button>
      <button on:click={() => audioEl.pause()}>⏹ Stop</button>
    </div>

  {:else if phase === 'guess'}
    <p class="center"><strong>Artist:</strong> {track.artist}</p>
    <div class="controls">
      <button on:click={replaySnippet}>▶️ Replay</button>
      <button on:click={() => audioEl.pause()}>⏹ Stop</button>
    </div>
    <div class="guess-form">
      <input type="text" bind:value={guess} placeholder="Enter song title" />
      <button on:click={submitGuess}>Submit Guess</button>
    </div>

  {:else if phase === 'result'}
    <div class="center">
      {#if result === 'correct'}
        <p class="correct">🎉 Correct! +10 points</p>
      {:else}
        <p class="wrong">❌ Wrong! It was “{track.title}”</p>
      {/if}
      <button on:click={nextRound}>Next ➡️</button>
    </div>

  {:else if phase === 'finished'}
    <div class="center">
      <h2>Game Over</h2>
      <p>Your final score: {score}</p>
      <button on:click={() => goto('/app/leaderboard')}>View Leaderboard</button>
      <button on:click={fetchPool}>🔄 Play Again</button>
    </div>
  {/if}
</section>

<style>
  .card {
    max-width: 600px;
    margin: 3rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    font-family: system-ui, sans-serif;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .end-game {
    background: #c0392b;
    color: #fff;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
  }
  .end-game:hover {
    background: #8e2a1d;
  }

  .center {
    text-align: center;
    margin: 1rem 0;
  }

  .error {
    color: #b00020;
  }

  .hidden {
    display: none;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .fill {
    height: 100%;
    background: #ff3e00;
    transition: width 1s linear;
  }

  .countdown {
    font-size: 0.9rem;
    color: #555;
  }

  .controls,
  .guess-form {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 1rem 0;
  }

  button {
    background: #1e1e2f;
    color: #fff;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  button:hover {
    background: #333;
  }

  input {
    flex: 1 1 200px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .correct {
    color: #28a745;
    font-size: 1.2rem;
  }
  .wrong {
    color: #dc3545;
    font-size: 1.2rem;
  }
</style>
