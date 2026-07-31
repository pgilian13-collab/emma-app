export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  coverDataUrl: string | null;
  fileName: string;
  mimeType: string;
  size: number;
  hasHandle: boolean;
  createdAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface PlaybackSnapshot {
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  error: string | null;
}

export type FileSystemPermission = 'granted' | 'prompt' | 'denied';

export const SUPPORTED_AUDIO_MIME = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/vorbis',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/flac',
  'audio/x-flac',
];

export const SUPPORTED_AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'] as const;