// src/routes/app/leaderboard/+page.server.ts
import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  // Get top 10 players by score
  const leaderboard = await prisma.player.findMany({
    orderBy: {
      score: 'desc'
    },
    take: 10
  });

  return {
    leaderboard
  };
};
