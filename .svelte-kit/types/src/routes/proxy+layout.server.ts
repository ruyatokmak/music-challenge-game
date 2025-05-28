// @ts-nocheck
// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load = ({ locals }: Parameters<LayoutServerLoad>[0]) => {
  return {
    player: locals.player ?? null
  };
};
