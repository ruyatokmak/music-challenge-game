// src/routes/api/logout/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  // Clear the session cookie
  cookies.delete('session', { path: '/' });
  
  return json({ success: true });
};
