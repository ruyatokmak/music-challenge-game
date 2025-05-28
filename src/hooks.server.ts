// src/hooks.server.ts
import { PrismaClient } from '@prisma/client';
import type { Handle } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  
  if (session) {
    const player = await prisma.player.findUnique({
      where: { id: Number(session) }
    });
    event.locals.player = player ?? null;
  } else {
    event.locals.player = null;
  }
  
  return resolve(event);
};
