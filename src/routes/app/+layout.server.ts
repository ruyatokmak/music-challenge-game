// src/routes/app/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  if (!locals.player) {
    throw redirect(302, '/profile');
  }
  return { player: locals.player };
};
