import type { PlaybackSnapshot, PlaybackStatus } from '@modules/music/types';

type Listener = (snapshot: PlaybackSnapshot) => void;

const INITIAL: PlaybackSnapshot = {
  status: 'idle',
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  muted: false,
  error: null,
};

export class AudioController {
  readonly audio: HTMLAudioElement;
  private listeners = new Set<Listener>();
  private snapshot: PlaybackSnapshot = { ...INITIAL };
  private objectUrl: string | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.volume = INITIAL.volume;
    this.audio.addEventListener('loadedmetadata', this.handleMetadata);
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.addEventListener('play', this.handlePlay);
    this.audio.addEventListener('pause', this.handlePause);
    this.audio.addEventListener('volumechange', this.handleVolumeChange);
    this.audio.addEventListener('error', this.handleError);
  }

  getSnapshot(): PlaybackSnapshot {
    return this.snapshot;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean): void {
    this.audio.muted = muted;
  }

  async loadFromUrl(url: string): Promise<void> {
    this.revokeObjectUrl();
    this.audio.src = url;
    this.audio.load();
    this.update({ status: 'loading', error: null });
  }

  async play(): Promise<void> {
    if (!this.audio.src) return;
    try {
      await this.audio.play();
    } catch (error) {
      this.update({ status: 'error', error: (error as Error).message });
    }
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.update({ currentTime: 0 });
  }

  seek(time: number): void {
    if (!Number.isFinite(time)) return;
    const max = Number.isFinite(this.audio.duration) ? this.audio.duration : time;
    this.audio.currentTime = Math.max(0, Math.min(time, max));
  }

  destroy(): void {
    this.audio.pause();
    this.revokeObjectUrl();
    this.audio.removeAttribute('src');
    this.audio.load();
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private handleMetadata = (): void => {
    const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    const status: PlaybackStatus = this.audio.paused ? 'paused' : this.snapshot.status;
    this.update({ duration, status });
  };

  private handleTimeUpdate = (): void => {
    this.update({ currentTime: this.audio.currentTime });
  };

  private handlePlay = (): void => {
    this.update({ status: 'playing', error: null });
  };

  private handlePause = (): void => {
    if (this.snapshot.status !== 'error') {
      this.update({ status: 'paused' });
    }
  };

  private handleVolumeChange = (): void => {
    this.update({ volume: this.audio.volume, muted: this.audio.muted });
  };

  private handleError = (): void => {
    this.update({ status: 'error', error: 'No se pudo reproducir este archivo.' });
  };

  private update(patch: Partial<PlaybackSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of this.listeners) listener(this.snapshot);
  }
}

let instance: AudioController | null = null;

export function getAudioController(): AudioController {
  if (!instance) instance = new AudioController();
  return instance;
}