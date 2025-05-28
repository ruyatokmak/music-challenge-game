<script lang="ts">
    import { createEventDispatcher, onDestroy } from 'svelte';
    
    // Define the event dispatcher type
    const dispatch = createEventDispatcher<{
        expired: void;
    }>();
    
    export let timeLeft: number = 10;
    
    let intervalId: ReturnType<typeof setInterval> | undefined;
  
    function start(): void {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft -= 1;
        } else {
          clearInterval(intervalId);
          dispatch('expired');
        }
      }, 1000);
    }
  
    start();
  
    onDestroy(() => clearInterval(intervalId));
</script>
  
<div class="text-lg font-bold text-orange-500">{timeLeft}s</div>
