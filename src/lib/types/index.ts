/**
 * Global type definitions for the Music Challenge Game application
 */

/**
 * Player profile information
 */
export interface Player {
  id: number;
  name: string;
  country: string;
  gender: 'male' | 'female';
  score?: number;
}

/**
 * Song data structure
 */
export interface Song {
  id: number;
  title: string;
  artist: string;
  previewUrl: string;
  coverUrl?: string;
}

/**
 * Game session data
 */
export interface GameSession {
  id: number;
  playerId: number;
  score: number;
  date: string;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  player: Player;
  score: number;
  date: string;
}

/**
 * API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Form submission states
 */
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Game difficulty levels
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * App notification types
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * App notification
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
