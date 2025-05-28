// src/routes/api/register/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const { name, country, gender, password } = body;

  if (!name || !country || !gender || !password) {
    return json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    // Check if player already exists
    const existingPlayer = await prisma.player.findUnique({
      where: { name }
    });

    if (existingPlayer) {
      return json({ error: 'Player name already exists' }, { status: 400 });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new player
    const player = await prisma.player.create({
      data: {
        name,
        country,
        gender,
        password: hashedPassword
      }
    });

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
    console.error('Registration error:', error);
    return json({ error: 'An error occurred during registration' }, { status: 500 });
  }
};
