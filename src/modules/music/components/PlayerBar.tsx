import { useEffect, useRef, useState } from 'react';
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
  FiVolume2,
  FiVolumeX,
  FiSquare,
} from 'react-icons/fi';
import { cn } from '@utils/cn';
import { useMusicStore } from '@modules/music/store/musicStore';
import { useMusicActions } from '@modules/music/hooks/useMusicController';
import type { PlaybackStatus, RepeatMode } from '@modules/music/types';

interface PlayerBarProps {
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  error: string | null;
  language: 'es' | 'en';
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const REPEAT_LABEL: Record<RepeatMode, { es: string; en: string; active: boolean }> = {
  off: { es: 'Sin repetir', en: 'Repeat off', active: false },
  all: { es: 'Repetir todo', en: 'Repeat all', active: true },
  one: { es: 'Repetir una', en: 'Repeat one', active: true },
};

export function PlayerBar({ status, currentTime, duration, error, language }: PlayerBarProps) {
  const actions = useMusicActions();
  const queue = useMusicStore((s) => s.queue);
  const currentTrackId = useMusicStore((s) => s.currentTrackId);
  const shuffle = useMusicStore((s) => s.shuffle);
  const repeat = useMusicStore((s) => s.repeat);
  const volume = useMusicStore((s) => s.volume);
  const muted = useMusicStore((s) => s.muted);
  const toggleShuffle = useMusicStore((s) => s.toggleShuffle);
  const cycleRepeat = useMusicStore((s) => s.cycleRepeat);
  const setVolume = useMusicStore((s) => s.setVolume);
  const setMuted = useMusicStore((s) => s.setMuted);

  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const seekTimeout = useRef<number | null>(null);

  const es = language === 'es';
  const hasTrack = !!currentTrackId && queue.length > 0;
  const repeatMeta = REPEAT_LABEL[repeat];
  const isPlaying = status === 'playing';

  const displayTime = seeking ? seekValue : currentTime;
  const displayDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const progress = displayDuration > 0 ? (displayTime / displayDuration) * 100 : 0;

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSeeking(true);
    setSeekValue(value);
    if (seekTimeout.current) window.clearTimeout(seekTimeout.current);
    seekTimeout.current = window.setTimeout(() => {
      actions.seek(value);
      setSeeking(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (seekTimeout.current) window.clearTimeout(seekTimeout.current);
    };
  }, []);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
    if (muted) setMuted(false);
  };

  return (
    <div className="panel-card flex flex-col gap-4 p-5">
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="w-12 shrink-0 text-xs tabular-nums text-white/60">
          {formatTime(displayTime)}
        </span>
        <div className="relative flex-1">
          <div className="absolute inset-y-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/10" />
          <div
            className="absolute inset-y-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={displayDuration || 1}
            step={0.1}
            value={displayTime}
            onChange={handleSeekChange}
            disabled={!hasTrack}
            className="relative z-10 h-3 w-full appearance-none bg-transparent accent-primary disabled:opacity-40"
            aria-label={es ? 'Progreso' : 'Seek'}
          />
        </div>
        <span className="w-12 shrink-0 text-right text-xs tabular-nums text-white/60">
          {formatTime(displayDuration)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <IconToggle
            on={shuffle}
            onClick={() => toggleShuffle()}
            label={es ? 'Aleatorio' : 'Shuffle'}
            icon={<FiShuffle size={16} />}
          />
          <IconToggle
            on={repeatMeta.active}
            onClick={() => cycleRepeat()}
            label={es ? repeatMeta.es : repeatMeta.en}
            icon={
              <span className="relative">
                <FiRepeat size={16} />
                {repeat === 'one' ? (
                  <span className="absolute -right-1 -top-1 text-[9px] font-bold leading-none">1</span>
                ) : null}
              </span>
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <ControlButton
            onClick={() => actions.previous()}
            disabled={!hasTrack}
            ariaLabel={es ? 'Anterior' : 'Previous'}
            icon={<FiSkipBack size={18} />}
          />
          <button
            onClick={() => {
              if (status === 'playing') actions.stop();
              else void actions.togglePlay();
            }}
            disabled={!hasTrack && status !== 'playing'}
            aria-label={isPlaying ? (es ? 'Detener' : 'Stop') : (es ? 'Reproducir' : 'Play')}
            className={cn(
              'focus-ring flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow transition active:scale-95',
              'bg-gradient-to-br from-primary to-secondary hover:brightness-110',
              (!hasTrack && status !== 'playing') && 'opacity-50',
            )}
          >
            {status === 'playing' ? <FiSquare size={18} /> : <FiPlay size={20} className="ml-0.5" />}
          </button>
          <ControlButton
            onClick={() => actions.next()}
            disabled={!hasTrack}
            ariaLabel={es ? 'Siguiente' : 'Next'}
            icon={<FiSkipForward size={18} />}
          />
          <ControlButton
            onClick={() => actions.pause()}
            disabled={!isPlaying}
            ariaLabel={es ? 'Pausar' : 'Pause'}
            icon={<FiPause size={18} />}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            aria-label={muted ? (es ? 'Activar sonido' : 'Unmute') : (es ? 'Silenciar' : 'Mute')}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/5 hover:text-white"
          >
            {muted || volume === 0 ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          </button>
          <div className="relative w-24">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-primary"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #EC4899 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(muted ? 0 : volume) * 100}%)`,
              }}
              aria-label={es ? 'Volumen' : 'Volume'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  icon: React.ReactNode;
}

function ControlButton({ onClick, disabled, ariaLabel, icon }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl bg-panel text-white/80 transition hover:bg-panelLight hover:text-white active:scale-95 disabled:opacity-30"
    >
      {icon}
    </button>
  );
}

interface IconToggleProps {
  on: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

function IconToggle({ on, onClick, label, icon }: IconToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'focus-ring flex h-9 w-9 items-center justify-center rounded-lg transition',
        on ? 'bg-primary/20 text-primary-light' : 'text-white/60 hover:bg-white/5 hover:text-white',
      )}
    >
      {icon}
    </button>
  );
}