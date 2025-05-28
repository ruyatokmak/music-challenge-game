// src/routes/app/leaderboard/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  try {
    const leaderboard = await prisma.player.findMany({
      orderBy: {
        score: 'desc'
      },
      take: 10
    });
    
    return json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
};
