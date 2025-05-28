<script lang="ts">
    export let src: string = '';
    let audioEl: HTMLAudioElement;
    
    function playClip(): void { 
        audioEl.currentTime = 0; 
        audioEl.play(); 
    }
    
    function stopClip(): void { 
        audioEl.pause(); 
        audioEl.currentTime = 0; 
    }
</script>
  
<div class="flex justify-center gap-2 my-4">
    <audio bind:this={audioEl} src={src}></audio>
    <button on:click={playClip} class="px-4 py-2 bg-orange-500 text-white rounded">Play ▶️</button>
    <button on:click={stopClip} class="px-4 py-2 bg-gray-300 text-gray-800 rounded">Stop ◼️</button>
</div>
