// src/routes/api/login/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const { name, password } = body;

  if (!name || !password) {
    return json({ error: 'Name and password are required' }, { status: 400 });
  }

  try {
    // Find the player
    const player = await prisma.player.findUnique({
      where: { name }
    });

    if (!player) {
      return json({ error: 'Invalid name or password' }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, player.password);
    if (!passwordMatch) {
      return json({ error: 'Invalid name or password' }, { status: 401 });
    }

    // Set session cookie
    cookies.set('session', String(player.id), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return json({ error: 'An error occurred during login' }, { status: 500 });
  }
};
