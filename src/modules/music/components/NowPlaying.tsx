import { motion, AnimatePresence } from 'framer-motion';
import { FiMusic } from 'react-icons/fi';
import { useMusicStore } from '@modules/music/store/musicStore';
import type { PlaybackStatus } from '@modules/music/types';

interface NowPlayingProps {
  status: PlaybackStatus;
  language: 'es' | 'en';
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const STATUS_COPY: Record<PlaybackStatus, { es: string; en: string }> = {
  idle: { es: 'En pausa', en: 'Idle' },
  loading: { es: 'Cargando', en: 'Loading' },
  playing: { es: 'Reproduciendo', en: 'Playing' },
  paused: { es: 'En pausa', en: 'Paused' },
  error: { es: 'Error', en: 'Error' },
};

export function NowPlaying({ status, language }: NowPlayingProps) {
  const currentTrackId = useMusicStore((s) => s.currentTrackId);
  const track = useMusicStore((s) => s.queue.find((t) => t.id === currentTrackId));
  const es = language === 'es';
  const copy = STATUS_COPY[status];

  return (
    <div className="panel-card relative overflow-hidden p-6">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" aria-hidden />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-panel shadow-glow sm:h-40 sm:w-40">
          <AnimatePresence mode="wait">
            {track?.coverDataUrl ? (
              <motion.img
                key={track.id}
                src={track.coverDataUrl}
                alt={track.album}
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full w-full items-center justify-center bg-gradient-to-br from-panel to-panelLight"
              >
                <FiMusic size={36} className="text-white/30" />
              </motion.div>
            )}
          </AnimatePresence>
          {status === 'playing' ? (
            <div className="absolute bottom-2 right-2 flex h-6 items-end gap-0.5 rounded-full bg-black/60 px-2 py-1 backdrop-blur">
              <span className="block h-2 w-0.5 origin-bottom animate-pulse-soft rounded-full bg-primary-light" />
              <span className="block h-3 w-0.5 origin-bottom animate-pulse-soft rounded-full bg-primary-light [animation-delay:120ms]" />
              <span className="block h-2.5 w-0.5 origin-bottom animate-pulse-soft rounded-full bg-primary-light [animation-delay:60ms]" />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">
            {es ? copy.es : copy.en}
          </p>
          <h2 className="mt-1 truncate text-2xl font-bold text-white sm:text-3xl">
            {track?.name ?? (es ? 'Nada reproduciéndose' : 'Nothing playing')}
          </h2>
          <p className="mt-1 truncate text-sm text-white/70">
            {track?.artist ?? '—'}
          </p>
          <p className="truncate text-xs text-white/40">
            {track?.album ?? (es ? 'Carga una canción para empezar.' : 'Load a track to begin.')}
          </p>

          {track ? (
            <p className="mt-2 text-[11px] uppercase tracking-widest text-white/40">
              {formatDuration(track.duration)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}