<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    // Define the event dispatcher type
    const dispatch = createEventDispatcher<{
        submitGuess: string;
    }>();
    
    let guess: string = '';
  
    /**
     * Submits the user's guess if it's not empty
     */
    function submitForm(): void {
      if (guess.trim()) {
        dispatch('submitGuess', guess.trim());
        guess = '';
      }
    }
</script>
  
<div class="flex justify-center gap-2 my-4">
    <input
      type="text"
      placeholder="Your guess..."
      bind:value={guess}
      on:keydown={(e: KeyboardEvent) => e.key === 'Enter' && submitForm()}
      class="border rounded px-3 py-2 flex-1"
    />
    <button on:click={submitForm} class="px-4 py-2 bg-blue-600 text-white rounded">
      Submit
    </button>
</div>
