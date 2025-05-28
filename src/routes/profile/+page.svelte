<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    
    export let data: PageData;
  
    // If already authenticated, send to App Home
    if (data.player) {
      goto('/app/home');
    }
  
    // Define types for form data
    interface LoginForm {
      name: string;
      password: string;
    }
    
    interface RegisterForm {
      name: string;
      country: string;
      gender: 'male' | 'female';
      password: string;
    }
    
    interface ApiResponse {
      error?: string;
      [key: string]: any;
    }
  
    let mode: 'login' | 'register' = 'login';
    let error: string = '';
    let loading: boolean = false;
  
    // Registration fields
    let name: string = '';
    let country: string = '';
    let gender: 'male' | 'female' = 'male';
    let password: string = '';
    let confirmPwd: string = '';
  
    // Login fields
    let loginName: string = '';
    let loginPwd: string = '';
  
    async function submit(): Promise<void> {
      error = '';
      loading = true;
  
      // client-side confirm password
      if (mode === 'register' && password !== confirmPwd) {
        error = 'Passwords do not match.';
        loading = false;
        return;
      }
  
      // **Use the top-level API routes**
      const url: string = mode === 'login'
        ? '/api/login'
        : '/api/register';
  
      const body: LoginForm | RegisterForm = mode === 'login'
        ? { name: loginName.trim(), password: loginPwd }
        : {
            name: name.trim(),
            country: country.trim(),
            gender,
            password
          };
  
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
  
        if (res.ok) {
          // success → go into the app
          goto('/app/home');
        } else {
          // pull out error message or fallback
          const json: ApiResponse = await res.json().catch(() => ({}));
          error = json.error || 'Invalid name or password.';
        }
      } catch (e) {
        console.error('Fetch failed', e);
        error = 'Network error. Please try again.';
      } finally {
        loading = false;
      }
    }
</script>
  
<section class="profile-card">
    <h2>{mode === 'login' ? 'Login to Your Account' : 'Create a New Profile'}</h2>
  
    {#if error}
      <div class="error">{error}</div>
    {/if}
  
    <form on:submit|preventDefault={submit} class="form">
      {#if mode === 'register'}
        <div class="field">
          <label for="name">Name</label>
          <input id="name" type="text" bind:value={name} required />
        </div>
  
        <div class="field">
          <label for="country">Country</label>
          <input id="country" type="text" bind:value={country} required />
        </div>
  
        <div class="field">
          <label for="gender">Gender</label>
          <select id="gender" bind:value={gender}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
  
        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            minlength="6"
            required
          />
        </div>
  
        <div class="field">
          <label for="confirmPwd">Confirm Password</label>
          <input
            id="confirmPwd"
            type="password"
            bind:value={confirmPwd}
            minlength="6"
            required
          />
        </div>
      {:else}
        <div class="field">
          <label for="loginName">Name</label>
          <input id="loginName" type="text" bind:value={loginName} required />
        </div>
  
        <div class="field">
          <label for="loginPwd">Password</label>
          <input id="loginPwd" type="password" bind:value={loginPwd} required />
        </div>
      {/if}
  
      <button type="submit" class="submit-btn" disabled={loading}>
        {#if loading}
          {mode === 'login' ? 'Logging in…' : 'Registering…'}
        {:else}
          {mode === 'login' ? 'Login' : 'Register'}
        {/if}
      </button>
    </form>
  
    <p class="toggle">
      {mode === 'login' ? "New here?" : "Already have an account?"}
      <button
        type="button"
        class="toggle-btn"
        on:click={() => {
          mode = mode === 'login' ? 'register' : 'login';
          error = '';
        }}
        disabled={loading}
      >
        {mode === 'login' ? 'Register' : 'Login'}
      </button>
    </p>
</section>
  
<style>
    .profile-card {
      max-width: 400px;
      margin: 4rem auto;
      padding: 2rem;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      font-family: sans-serif;
    }
    .profile-card h2 {
      font-size: 1.75rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .error {
      background: #fdecea;
      color: #b00020;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .form .field {
      text-align: left;
      margin-bottom: 1rem;
    }
    .form label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 600;
      color: #555;
    }
    .form input,
    .form select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    .submit-btn {
      width: 100%;
      padding: 0.75rem;
      background: #2d8cf0;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    .submit-btn:disabled {
      background: #aaccee;
      cursor: wait;
    }
    .toggle {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #666;
    }
    .toggle-btn {
      background: none;
      border: none;
      color: #2d8cf0;
      cursor: pointer;
      text-decoration: underline;
      margin-left: 0.25rem;
      padding: 0;
      font-size: 0.9rem;
    }
    .toggle-btn:disabled {
      color: #aaccee;
      cursor: wait;
    }
</style>
