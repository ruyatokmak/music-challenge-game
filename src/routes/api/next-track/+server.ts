// src/routes/api/next-track/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database of songs for the game
const songs = [
  {
    id: 1,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    previewUrl: 'https://p.scdn.co/mp3-preview/6b51d3a9e2b13a454f9dc9c7a4c5a6f23a1a7fa6',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273365b3fb800c19f7ff72602da'
  },
  {
    id: 2,
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    previewUrl: 'https://p.scdn.co/mp3-preview/f504e6b8e037771318656394f532dede4f9bcaea',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2737c5e93f7c67920b7d15d5a66'
  },
  {
    id: 3,
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    previewUrl: 'https://p.scdn.co/mp3-preview/825ebff4d0d9cbf5f7d8441e5f3af8fc4cc32fcd',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273bdba586eb69c503f7ff8d8c9'
  },
  {
    id: 4,
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    previewUrl: 'https://p.scdn.co/mp3-preview/5a24f51c448e8a737666eaf6c2178c6c8b61a233',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf'
  },
  {
    id: 5,
    title: 'Hotel California',
    artist: 'Eagles',
    previewUrl: 'https://p.scdn.co/mp3-preview/410543c6d7439f2d896b149a4c3b5bb47a1fe9d4',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d12a63e30f72f7eb5351ad77'
  }
];

export const GET: RequestHandler = async ({ locals }) => {
  // Ensure user is authenticated
  if (!locals.player) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get a random song
    const randomIndex = Math.floor(Math.random() * songs.length);
    const song = songs[randomIndex];
    
    return json({ song });
  } catch (error) {
    console.error('Error fetching next track:', error);
    return json({ error: 'Failed to fetch next track' }, { status: 500 });
  }
};
