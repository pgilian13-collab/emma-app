import { useEffect, useState } from 'react';
import { useSettingsStore } from '@store/settingsStore';
import { useMusicController } from '@modules/music/hooks/useMusicController';
import { useMusicKeyboard } from '@modules/music/hooks/useMusicKeyboard';
import { useMusicStore } from '@modules/music/store/musicStore';
import { NowPlaying } from './NowPlaying';
import { PlayerBar } from './PlayerBar';
import { TrackList } from './TrackList';
import { FileLoader } from './FileLoader';
import { EmptyState } from './EmptyState';
import type { PlaybackStatus } from '@modules/music/types';

export function MusicWorkspace() {
  const language = useSettingsStore((s) => s.language);
  const queueLength = useMusicStore((s) => s.queue.length);

  const [live, setLive] = useState<{
    status: PlaybackStatus;
    currentTime: number;
    duration: number;
    error: string | null;
  }>({
    status: 'idle',
    currentTime: 0,
    duration: 0,
    error: null,
  });

  useMusicController(setLive);
  useMusicKeyboard(true);

  useEffect(() => {
    document.title = live.status === 'playing' ? '♪ EMMA · Música' : 'EMMA';
  }, [live.status]);

  if (queueLength === 0) {
    return <EmptyState language={language} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <NowPlaying status={live.status} language={language} />
      <PlayerBar
        status={live.status}
        currentTime={live.currentTime}
        duration={live.duration}
        error={live.error}
        language={language}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrackList language={language} />
        </div>
        <FileLoader language={language} trackCount={queueLength} />
      </div>
    </div>
  );
}