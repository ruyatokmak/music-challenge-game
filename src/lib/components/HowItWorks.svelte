<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    

    interface HowItWorksProps {
        isOpen?: boolean;
    }
    
    // Define the event dispatcher type
    const dispatch = createEventDispatcher<{
        close: void;
    }>();
    
    export let isOpen: boolean = false;
    

    function closeModal(): void {
        dispatch('close');
    }
    
    // Handle escape key for accessibility
    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && isOpen) {
            closeModal();
        }
    }
    
    onMount(() => {
        document.addEventListener('keydown', handleKeydown);
        
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    });
</script>

{#if isOpen}
<div class="modal-backdrop" on:click={closeModal} role="dialog" aria-modal="true" aria-labelledby="how-it-works-title">
    <div class="modal-content" on:click|stopPropagation={() => {}}>
        <button class="close-btn" on:click={closeModal} aria-label="Close how it works">×</button>
        
        <h2 id="how-it-works-title">How to Play</h2>
        
        <div class="steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h3>Listen to the Preview</h3>
                    <p>A short clip from a popular song will play. Listen carefully!</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h3>Guess the Song</h3>
                    <p>Type your guess for the song title in the input field.</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h3>Score Points</h3>
                    <p>Earn points for correct guesses. The faster you guess, the more points you get!</p>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h3>Climb the Leaderboard</h3>
                    <p>Compete with other players to reach the top of the leaderboard.</p>
                </div>
            </div>
        </div>
        
        <div class="tips">
            <h3>Tips:</h3>
            <ul>
                <li>You can replay the clip as many times as needed</li>
                <li>Spelling doesn't have to be perfect, but try to be close</li>
                <li>Each game consists of 10 songs to guess</li>
            </ul>
        </div>
    </div>
</div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }
    
    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 1.75rem;
    }
    
    .steps {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .step {
        display: flex;
        gap: 1rem;
    }
    
    .step-number {
        background: #ff3e00;
        color: white;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        flex-shrink: 0;
    }
    
    .step-content h3 {
        margin: 0 0 0.5rem 0;
        color: #444;
    }
    
    .step-content p {
        margin: 0;
        color: #666;
    }
    
    .tips {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
    }
    
    .tips h3 {
        margin-top: 0;
        color: #444;
    }
    
    .tips ul {
        margin: 0;
        padding-left: 1.5rem;
    }
    
    .tips li {
        margin-bottom: 0.5rem;
        color: #666;
    }

    @media (max-width: 480px) {
        .modal-content {
            padding: 1.5rem;
        }
        
        .step {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .step-number {
            margin-bottom: 0.25rem;
        }
    }
</style>
