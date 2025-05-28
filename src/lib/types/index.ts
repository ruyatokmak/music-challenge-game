export interface Player {
  id: number;
  name: string;
  country: string;
  gender: 'male' | 'female';
  score?: number;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  previewUrl: string;
  coverUrl?: string;
}

export interface GameSession {
  id: number;
  playerId: number;
  score: number;
  date: string;
}
export interface LeaderboardEntry {
  player: Player;
  score: number;
  date: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type ThemeMode = 'light' | 'dark' | 'system';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';


export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
