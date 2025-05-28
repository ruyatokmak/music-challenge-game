import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ locals }) => {
  const playerId = locals.playerId;
  
  if (!playerId) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  try {
    // Get player data
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        country: true,
        gender: true,
        score: true,
        createdAt: true
      }
    });
    
    if (!player) {
      return json({ error: 'Player not found' }, { status: 404 });
    }
    
    return json({ user: player });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return json({ error: 'An error occurred while fetching profile' }, { status: 500 });
  }
};
