import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMusic, FiPlay } from 'react-icons/fi';
import { useMusicStore } from '@modules/music/store/musicStore';
import { useMusicActions } from '@modules/music/hooks/useMusicController';
import { getFileRegistry } from '@modules/music/services/fileRegistry';
import { cn } from '@utils/cn';
import type { Track } from '@modules/music/types';

interface TrackListProps {
  language: 'es' | 'en';
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TrackList({ language }: TrackListProps) {
  const queue = useMusicStore((s) => s.queue);
  const currentTrackId = useMusicStore((s) => s.currentTrackId);
  const removeTrack = useMusicStore((s) => s.removeTrack);
  const clearQueue = useMusicStore((s) => s.clearQueue);
  const actions = useMusicActions();
  const es = language === 'es';

  if (queue.length === 0) {
    return null;
  }

  const handleRemove = (track: Track) => {
    getFileRegistry().remove(track.id);
    removeTrack(track.id);
  };

  const handleClearAll = () => {
    if (window.confirm(es ? '¿Eliminar toda la cola?' : 'Clear entire queue?')) {
      getFileRegistry().clear();
      clearQueue();
    }
  };

  return (
    <div className="panel-card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
          {es ? 'Cola de reproducción' : 'Queue'}
        </h3>
        <button
          onClick={handleClearAll}
          className="focus-ring rounded-lg p-1.5 text-white/40 transition hover:bg-red-500/10 hover:text-red-300"
          aria-label={es ? 'Vaciar cola' : 'Clear queue'}
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      <ul className="flex max-h-[420px] flex-col gap-1 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {queue.map((track, index) => {
            const isCurrent = track.id === currentTrackId;
            return (
              <motion.li
                key={track.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: index < 8 ? index * 0.015 : 0 }}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition',
                  isCurrent
                    ? 'border-primary/40 bg-primary/10'
                    : 'hover:border-white/10 hover:bg-white/5',
                )}
              >
                <button
                  onClick={() => void actions.play(track.id)}
                  className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel/80 text-white/80 transition hover:bg-primary hover:text-white"
                  aria-label={es ? 'Reproducir' : 'Play'}
                >
                  {track.coverDataUrl ? (
                    <img
                      src={track.coverDataUrl}
                      alt=""
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : isCurrent ? (
                    <FiPlay size={14} />
                  ) : (
                    <FiMusic size={14} />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-sm font-medium',
                      isCurrent ? 'text-primary-light' : 'text-white',
                    )}
                  >
                    {track.name}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {track.artist} · {track.album}
                  </p>
                </div>

                <span className="shrink-0 text-xs tabular-nums text-white/40">
                  {formatDuration(track.duration)}
                </span>

                <button
                  onClick={() => handleRemove(track)}
                  className="focus-ring shrink-0 rounded-lg p-1.5 text-white/30 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-300"
                  aria-label={es ? 'Eliminar' : 'Remove'}
                >
                  <FiTrash2 size={14} />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}