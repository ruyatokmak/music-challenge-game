import { redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is logged in
  const playerId = locals.playerId;
  
  if (!playerId) {
    throw redirect(302, '/profile');
  }
  
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
    throw redirect(302, '/profile');
  }
  
  return {
    player
  };
};
