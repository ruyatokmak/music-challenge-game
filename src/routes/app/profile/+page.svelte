<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { PrismaClient } from '@prisma/client';
    
    let user = null;
    let friends = [];
    let friendRequests = [];
    let searchResults = [];
    let searchQuery = '';
    let loading = false;
    let error = '';
    let success = '';
    
    // Get user data from the page data
    export let data;
    
    onMount(async () => {
        try {
            if (data && data.player) {
                user = data.player;
                
                // Fetch friends list
                await loadFriends();
                
                // Fetch friend requests
                await loadFriendRequests();
            } else {
                // Backup method: Fetch user profile data
                const userRes = await fetch('/api/profile');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    user = userData.user;
                    
                    // Fetch friends list
                    await loadFriends();
                    
                    // Fetch friend requests
                    await loadFriendRequests();
                } else {
                    // Not logged in, redirect to login
                    goto('/profile');
                }
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            error = 'Failed to load profile data. Please try again.';
        }
    });
    
    async function loadFriends() {
        try {
            const friendsRes = await fetch('/api/friends');
            if (friendsRes.ok) {
                const data = await friendsRes.json();
                friends = data.friends || [];
            }
        } catch (err) {
            console.error('Error loading friends:', err);
        }
    }
    
    async function loadFriendRequests() {
        try {
            const requestsRes = await fetch('/api/friend-requests');
            if (requestsRes.ok) {
                const data = await requestsRes.json();
                friendRequests = data.requests || [];
            }
        } catch (err) {
            console.error('Error loading friend requests:', err);
        }
    }
    
    async function searchUsers() {
        if (!searchQuery.trim()) return;
        
        loading = true;
        error = '';
        try {
            const res = await fetch(`/api/search-users?query=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                searchResults = data.users || [];
            } else {
                const errorData = await res.json();
                error = errorData.error || 'Failed to search users';
            }
        } catch (err) {
            console.error('Error searching users:', err);
            error = 'Network error. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    async function sendFriendRequest(userId) {
        loading = true;
        error = '';
        success = '';
        try {
            const res = await fetch('/api/send-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            });
            
            if (res.ok) {
                success = 'Friend request sent successfully!';
                // Remove from search results
                searchResults = searchResults.filter(user => user.id !== userId);
            } else {
                const errorData = await res.json();
                error = errorData.error || 'Failed to send friend request';
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            error = 'Network error. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    async function acceptFriendRequest(requestId) {
        loading = true;
        error = '';
        success = '';
        try {
            const res = await fetch('/api/accept-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requestId })
            });
            
            if (res.ok) {
                success = 'Friend request accepted!';
                // Refresh friend requests and friends list
                await loadFriendRequests();
                await loadFriends();
            } else {
                const errorData = await res.json();
                error = errorData.error || 'Failed to accept friend request';
            }
        } catch (err) {
            console.error('Error accepting friend request:', err);
            error = 'Network error. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    async function rejectFriendRequest(requestId) {
        loading = true;
        error = '';
        try {
            const res = await fetch('/api/reject-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requestId })
            });
            
            if (res.ok) {
                // Refresh friend requests
                await loadFriendRequests();
            } else {
                const errorData = await res.json();
                error = errorData.error || 'Failed to reject friend request';
            }
        } catch (err) {
            console.error('Error rejecting friend request:', err);
            error = 'Network error. Please try again.';
        } finally {
            loading = false;
        }
    }
    
    async function removeFriend(friendId) {
        if (!confirm('Are you sure you want to remove this friend?')) return;
        
        loading = true;
        error = '';
        try {
            const res = await fetch('/api/remove-friend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId })
            });
            
            if (res.ok) {
                // Refresh friends list
                await loadFriends();
            } else {
                const errorData = await res.json();
                error = errorData.error || 'Failed to remove friend';
            }
        } catch (err) {
            console.error('Error removing friend:', err);
            error = 'Network error. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Profile - Music Challenge</title>
</svelte:head>

<div class="profile-container">
    <h1>Your Profile</h1>
    
    {#if error}
        <div class="error-message">{error}</div>
    {/if}
    
    {#if success}
        <div class="success-message">{success}</div>
    {/if}
    
    {#if user}
        <div class="profile-card">
            <div class="profile-header">
                <div class="avatar">
                    <!-- Default avatar with first letter of name -->
                    <div class="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
                </div>
                <div class="profile-info">
                    <h2>{user.name}</h2>
                    <p><strong>Country:</strong> {user.country}</p>
                    <p><strong>Gender:</strong> {user.gender}</p>
                    <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>Your Stats</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">{user.score || 0}</span>
                        <span class="stat-label">Total Score</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{friends.length}</span>
                        <span class="stat-label">Friends</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="friends-section">
            <h3>Your Friends</h3>
            
            {#if friends.length === 0}
                <p class="empty-state">You don't have any friends yet. Search for users to add friends!</p>
            {:else}
                <div class="friends-grid">
                    {#each friends as friend}
                        <div class="friend-card">
                            <div class="friend-avatar">{friend.name.charAt(0).toUpperCase()}</div>
                            <div class="friend-info">
                                <h4>{friend.name}</h4>
                                <p>{friend.country}</p>
                            </div>
                            <button class="remove-friend-btn" on:click={() => removeFriend(friend.id)}>
                                Remove
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
            
            {#if friendRequests.length > 0}
                <h3>Friend Requests</h3>
                <div class="friend-requests">
                    {#each friendRequests as request}
                        <div class="request-card">
                            <div class="request-avatar">{request.sender.name.charAt(0).toUpperCase()}</div>
                            <div class="request-info">
                                <h4>{request.sender.name}</h4>
                                <p>{request.sender.country}</p>
                            </div>
                            <div class="request-actions">
                                <button class="accept-btn" on:click={() => acceptFriendRequest(request.id)}>
                                    Accept
                                </button>
                                <button class="reject-btn" on:click={() => rejectFriendRequest(request.id)}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
            
            <div class="search-section">
                <h3>Find Friends</h3>
                <div class="search-form">
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        bind:value={searchQuery}
                        on:keyup={(e) => e.key === 'Enter' && searchUsers()}
                    />
                    <button class="search-btn" on:click={searchUsers} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                
                {#if searchResults.length > 0}
                    <div class="search-results">
                        {#each searchResults as user}
                            <div class="user-card">
                                <div class="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                <div class="user-info">
                                    <h4>{user.name}</h4>
                                    <p>{user.country}</p>
                                </div>
                                <button class="add-friend-btn" on:click={() => sendFriendRequest(user.id)}>
                                    Add Friend
                                </button>
                            </div>
                        {/each}
                    </div>
                {:else if searchQuery && !loading}
                    <p class="empty-state">No users found matching "{searchQuery}"</p>
                {/if}
            </div>
        </div>
    {:else}
        <div class="loading">Loading profile...</div>
    {/if}
</div>

<style>
    .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
    
    h1 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: #333;
        text-align: center;
    }
    
    .error-message {
        background: #fdecea;
        color: #b00020;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    
    .success-message {
        background: #e8f5e9;
        color: #2e7d32;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    
    .profile-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .profile-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .avatar {
        margin-right: 1.5rem;
    }
    
    .avatar-placeholder {
        width: 80px;
        height: 80px;
        background: #4a6cf7;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
    }
    
    .profile-info h2 {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
    }
    
    .profile-info p {
        margin: 0.25rem 0;
        color: #555;
    }
    
    .stats-section h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: #333;
    }
    
    .stats-grid {
        display: flex;
        gap: 1rem;
    }
    
    .stat-item {
        flex: 1;
        background: #f5f7ff;
        border-radius: 6px;
        padding: 1rem;
        text-align: center;
    }
    
    .stat-value {
        display: block;
        font-size: 1.75rem;
        font-weight: bold;
        color: #4a6cf7;
        margin-bottom: 0.25rem;
    }
    
    .stat-label {
        color: #666;
        font-size: 0.9rem;
    }
    
    .friends-section {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1.5rem;
    }
    
    .friends-section h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: #333;
    }
    
    .empty-state {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 6px;
    }
    
    .friends-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .friend-card, .request-card, .user-card {
        display: flex;
        align-items: center;
        background: #f5f7ff;
        border-radius: 6px;
        padding: 0.75rem;
    }
    
    .friend-avatar, .request-avatar, .user-avatar {
        width: 40px;
        height: 40px;
        background: #4a6cf7;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-right: 0.75rem;
    }
    
    .friend-info, .request-info, .user-info {
        flex: 1;
    }
    
    .friend-info h4, .request-info h4, .user-info h4 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
    }
    
    .friend-info p, .request-info p, .user-info p {
        margin: 0;
        font-size: 0.85rem;
        color: #666;
    }
    
    .remove-friend-btn, .reject-btn {
        background: #ff3e00;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
        cursor: pointer;
    }
    
    .accept-btn, .add-friend-btn {
        background: #4a6cf7;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
        cursor: pointer;
        margin-right: 0.5rem;
    }
    
    .request-actions {
        display: flex;
    }
    
    .friend-requests {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .search-section {
        margin-top: 2rem;
    }
    
    .search-form {
        display: flex;
        margin-bottom: 1rem;
    }
    
    .search-form input {
        flex: 1;
        padding: 0.6rem;
        border: 1px solid #ddd;
        border-radius: 4px 0 0 4px;
        font-size: 1rem;
    }
    
    .search-btn {
        background: #4a6cf7;
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        padding: 0 1rem;
        cursor: pointer;
    }
    
    .search-results {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: #666;
        font-style: italic;
    }
    
    @media (max-width: 600px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
        }
        
        .avatar {
            margin-right: 0;
            margin-bottom: 1rem;
        }
        
        .stats-grid {
            flex-direction: column;
        }
        
        .friends-grid, .friend-requests, .search-results {
            grid-template-columns: 1fr;
        }
    }
</style>
