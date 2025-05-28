// @ts-nocheck
// src/routes/app/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = ({ locals }: Parameters<LayoutServerLoad>[0]) => {
  if (!locals.player) {
    throw redirect(302, '/profile');
  }
  return { player: locals.player };
};
