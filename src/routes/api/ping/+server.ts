// src/routes/api/ping/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({ status: 'ok', timestamp: new Date().toISOString() });
};
