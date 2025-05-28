// src/routes/api/auth/callback/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    // Get the redirect URI from the cookie
    const redirectUri = cookies.get('oauth_redirect') || '/app/home';
    
    // Clear the redirect cookie
    cookies.delete('oauth_redirect', { path: '/' });
    
    // In a real OAuth flow, we would validate the token here
    // For this implementation, we'll simulate a successful authentication
    // with a mock user
    
    // Check if the mock user exists, create if not
    let player = await prisma.player.findUnique({
      where: { name: 'demo_user' }
    });
    
    if (!player) {
      // Create a demo user
      player = await prisma.player.create({
        data: {
          name: 'demo_user',
          country: 'Demo Country',
          gender: 'male',
          password: 'hashed_password_would_go_here'
        }
      });
    }
    
    // Set session cookie
    cookies.set('session', String(player.id), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    // Redirect to the original destination
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUri
      }
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    
    // Redirect to error page or login
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/profile?error=auth_failed'
      }
    });
  }
};
