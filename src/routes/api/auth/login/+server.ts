// src/routes/api/auth/login/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
  // This would typically redirect to an OAuth provider
  // For this implementation, we'll just simulate the flow
  
  const redirectUri = url.searchParams.get('redirect_uri') || '/app/home';
  
  // Store the redirect URI in a cookie for the callback to use
  cookies.set('oauth_redirect', redirectUri, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });
  
  // Redirect to the callback endpoint (simulating OAuth provider redirect)
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/api/auth/callback'
    }
  });
};
