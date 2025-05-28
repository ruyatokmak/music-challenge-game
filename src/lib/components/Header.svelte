<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { setupMobileMenu } from '$lib/utils/mobileMenu';
    

    interface NavItem {
        href: string;
        label: string;
        matchPattern: (path: string) => boolean;
    }
    
    // Define navigation items
    const navItems: NavItem[] = [
        {
            href: '/app/home',
            label: 'Home',
            matchPattern: (path: string) => path === '/app/home'
        },
        {
            href: '/app/play',
            label: 'Play',
            matchPattern: (path: string) => path.startsWith('/app/play')
        },
        {
            href: '/app/leaderboard',
            label: 'Leaderboard',
            matchPattern: (path: string) => path.startsWith('/app/leaderboard')
        }
    ];
    
    export interface UserProfile {
        name: string;
        id: number;
    }
    export let user: UserProfile | null = null;
    
    export let hideAuth: boolean = false;
    
    // References for mobile menu functionality
    let navMenu: HTMLElement;
    let mobileMenuBtn: HTMLElement;
    
    onMount(() => {
        if (navMenu && mobileMenuBtn) {
            setupMobileMenu(navMenu, mobileMenuBtn);
        }
    });
</script>

<header class="header">
    <div class="container">
        <div class="logo">
            <a href="/" aria-label="Music Challenge Home">🎵 Music Challenge</a>
        </div>
        
        <nav class="nav-menu" bind:this={navMenu}>
            {#if user}
                <div class="nav-links">
                    {#each navItems as item}
                        <a 
                            href={item.href}
                            class="nav-link"
                            class:active={item.matchPattern($page.url.pathname)}
                            aria-current={item.matchPattern($page.url.pathname) ? 'page' : undefined}
                        >
                            {item.label}
                        </a>
                    {/each}
                </div>
                
                <div class="user-section">
                    <span class="username">{user.name}</span>
                    <a href="/app/profile" class="profile-link">Profile</a>
                    <form method="POST" action="/api/logout">
                        <button type="submit" class="logout-btn" on:click|preventDefault={async () => {
                            const res = await fetch('/api/logout', {
                                method: 'POST'
                            });
                            if (res.ok) {
                                window.location.href = '/';
                            }
                        }}>Logout</button>
                    </form>
                </div>
            {:else}
                <div class="auth-links">
                    {#if !hideAuth}
                        <a href="/profile" class="auth-link">Sign In / Register</a>
                    {/if}
                </div>
            {/if}
        </nav>
        
        <button 
            class="mobile-menu-btn" 
            bind:this={mobileMenuBtn}
            aria-expanded="false"
            aria-controls="nav-menu"
            aria-label="Toggle navigation menu"
        >
            <span class="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
    </div>
</header>

<style>
    .header {
        background: #1e1e2f;
        color: #fff;
        padding: 0.75rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }
    
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    
    .logo a {
        font-size: 1.25rem;
        font-weight: 700;
        color: #fff;
        text-decoration: none;
        display: flex;
        align-items: center;
    }
    
    .nav-menu {
        display: flex;
        align-items: center;
    }
    
    .nav-links {
        display: flex;
        gap: 1.5rem;
    }
    
    .nav-link {
        color: #ddd;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 0;
        transition: color 0.2s;
    }
    
    .nav-link:hover {
        color: #fff;
    }
    
    .nav-link.active {
        color: #fff;
        font-weight: 700;
        border-bottom: 2px solid #ff3e00;
    }
    
    .user-section {
        display: flex;
        align-items: center;
        margin-left: 2rem;
        gap: 1rem;
    }
    
    .username {
        font-weight: 500;
    }
    
    .logout-btn {
        background: #ff3e00;
        border: none;
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.2s;
    }
    
    .logout-btn:hover {
        background: #e03600;
    }
    
    .auth-links {
        display: flex;
    }
    
    .auth-link {
        color: #fff;
        text-decoration: none;
        background: #ff3e00;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        transition: background 0.2s;
    }
    
    .profile-link {
        color: #fff;
        text-decoration: none;
        background: #4a6cf7;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        margin-right: 0.5rem;
        transition: background 0.2s;
    }
    
    .profile-link:hover {
        background: #3a5ce7;
    }  
    .auth-link:hover {
        background: #e03600;
    }
    
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
    
    @media (max-width: 768px) {
        .nav-links, .user-section {
            display: none;
        }
        
        .mobile-menu-btn {
            display: block;
        }
        
    
        .nav-menu.open {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1e1e2f;
            flex-direction: column;
            padding: 1rem;
        }
        
        .nav-menu.open .nav-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .nav-menu.open .user-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 0;
        }
    }
</style>
