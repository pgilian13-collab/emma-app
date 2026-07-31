import { useEffect } from 'react';
import { getAudioController } from '@modules/music/services/audioController';
import {
  nextIndex,
  previousIndex,
  useMusicStore,
} from '@modules/music/store/musicStore';

export function useMusicKeyboard(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || target.isContentEditable) return;
      }

      const controller = getAudioController();
      const state = useMusicStore.getState();

      switch (event.code) {
        case 'Space': {
          event.preventDefault();
          const snap = controller.getSnapshot();
          if (snap.status === 'playing') controller.pause();
          else void controller.play();
          break;
        }
        case 'ArrowRight': {
          const idx = nextIndex(state);
          if (idx !== null) {
            const track = state.queue[idx];
            if (track) state.setCurrentTrack(track.id);
          }
          break;
        }
        case 'ArrowLeft': {
          const idx = previousIndex(state);
          if (idx !== null) {
            const track = state.queue[idx];
            if (track) state.setCurrentTrack(track.id);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          state.setVolume(Math.min(1, state.volume + 0.05));
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          state.setVolume(Math.max(0, state.volume - 0.05));
          break;
        }
        case 'KeyM': {
          state.setMuted(!state.muted);
          break;
        }
        case 'KeyS': {
          state.toggleShuffle();
          break;
        }
        case 'KeyR': {
          state.cycleRepeat();
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled]);
}