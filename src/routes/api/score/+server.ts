// src/routes/api/score/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
  // Ensure user is authenticated
  if (!locals.player) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { score } = body;
    
    if (typeof score !== 'number' || score < 0) {
      return json({ error: 'Invalid score value' }, { status: 400 });
    }

    // Record the score
    await prisma.score.create({
      data: {
        value: score,
        playerId: locals.player.id
      }
    });

    // Update player's highest score if needed
    const player = await prisma.player.findUnique({
      where: { id: locals.player.id },
      include: { scores: true }
    });

    if (player) {
      const highestScore = Math.max(...player.scores.map(s => s.value), 0);
      
      if (highestScore > (player.score || 0)) {
        await prisma.player.update({
          where: { id: player.id },
          data: { score: highestScore }
        });
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error saving score:', error);
    return json({ error: 'Failed to save score' }, { status: 500 });
  }
};
