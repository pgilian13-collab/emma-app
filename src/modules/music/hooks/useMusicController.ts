import { useEffect, useRef } from 'react';
import { getAudioController } from '@modules/music/services/audioController';
import { getFileRegistry } from '@modules/music/services/fileRegistry';
import {
  nextIndex,
  previousIndex,
  useMusicStore,
} from '@modules/music/store/musicStore';
import type { PlaybackStatus } from '@modules/music/types';

export interface LivePlayback {
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  error: string | null;
}

export function useMusicController(onLive: (state: LivePlayback) => void): void {
  const controller = getAudioController();
  const onLiveRef = useRef(onLive);
  onLiveRef.current = onLive;

  useEffect(() => {
    const unsub = controller.subscribe((snap) => {
      onLiveRef.current({
        status: snap.status,
        currentTime: snap.currentTime,
        duration: snap.duration,
        error: snap.error,
      });
    });
    return unsub;
  }, [controller]);

  useEffect(() => {
    const initial = useMusicStore.getState();
    controller.setVolume(initial.volume);
    controller.setMuted(initial.muted);

    const unsubStore = useMusicStore.subscribe((state, previous) => {
      if (state.volume !== previous.volume) controller.setVolume(state.volume);
      if (state.muted !== previous.muted) controller.setMuted(state.muted);
    });

    const onEnded = async () => {
      const state = useMusicStore.getState();
      if (state.repeat === 'one') {
        controller.seek(0);
        await controller.play();
        return;
      }
      const idx = nextIndex(state);
      if (idx === null) {
        controller.stop();
        useMusicStore.getState().setCurrentTrack(null);
        return;
      }
      const track = state.queue[idx];
      if (track) useMusicStore.getState().setCurrentTrack(track.id);
    };

    controller.audio.addEventListener('ended', onEnded);

    return () => {
      unsubStore();
      controller.audio.removeEventListener('ended', onEnded);
    };
  }, [controller]);

  useEffect(() => {
    let cancelled = false;

    const syncCurrent = async () => {
      const { currentTrackId } = useMusicStore.getState();
      if (!currentTrackId) {
        controller.stop();
        return;
      }
      const registry = getFileRegistry();
      const file = registry.get(currentTrackId);
      if (!file) {
        controller.stop();
        return;
      }
      const url = registry.getOrCreateUrl(currentTrackId);
      if (!url || cancelled) return;
      await controller.loadFromUrl(url);
      if (!cancelled) await controller.play();
    };

    void syncCurrent();

    const unsub = useMusicStore.subscribe(async (state, prev) => {
      if (state.currentTrackId === prev.currentTrackId) return;
      if (!state.currentTrackId) {
        controller.stop();
        return;
      }
      const registry = getFileRegistry();
      const file = registry.get(state.currentTrackId);
      if (!file) {
        controller.stop();
        return;
      }
      const url = registry.getOrCreateUrl(state.currentTrackId);
      if (!url) return;
      await controller.loadFromUrl(url);
      await controller.play();
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, [controller]);
}

export function useMusicActions() {
  const controller = getAudioController();

  return {
    play: async (trackId?: string) => {
      if (trackId) {
        useMusicStore.getState().setCurrentTrack(trackId);
        return;
      }
      await controller.play();
    },
    togglePlay: async () => {
      const snap = controller.getSnapshot();
      if (snap.status === 'playing') {
        controller.pause();
        return;
      }
      const state = useMusicStore.getState();
      if (!state.currentTrackId && state.queue.length > 0) {
        const first = state.queue[0];
        if (first) useMusicStore.getState().setCurrentTrack(first.id);
        return;
      }
      await controller.play();
    },
    pause: () => controller.pause(),
    stop: () => controller.stop(),
    next: () => {
      const state = useMusicStore.getState();
      const idx = nextIndex(state);
      if (idx === null) return;
      const track = state.queue[idx];
      if (track) useMusicStore.getState().setCurrentTrack(track.id);
    },
    previous: () => {
      const state = useMusicStore.getState();
      const idx = previousIndex(state);
      if (idx === null) return;
      const track = state.queue[idx];
      if (track) useMusicStore.getState().setCurrentTrack(track.id);
    },
    seek: (time: number) => controller.seek(time),
    setVolume: (volume: number) => useMusicStore.getState().setVolume(volume),
    setMuted: (muted: boolean) => useMusicStore.getState().setMuted(muted),
  };
}