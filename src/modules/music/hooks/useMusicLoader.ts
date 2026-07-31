import { useCallback, useState } from 'react';
import {
  isAudioFile,
  pickWithFileSystemAccess,
  isFileSystemAccessSupported,
} from '@modules/music/services/filePickerService';
import {
  extractMetadata,
  toTrack,
  makeTrackId,
} from '@modules/music/services/metadataService';
import {
  saveTracks,
  saveHandle,
} from '@modules/music/services/trackStorageService';
import { getFileRegistry } from '@modules/music/services/fileRegistry';
import { useMusicStore } from '@modules/music/store/musicStore';
import type { Track } from '@modules/music/types';

interface LoaderState {
  loading: boolean;
  lastError: string | null;
  lastCount: number;
}

export interface UseMusicLoader {
  loading: boolean;
  error: string | null;
  fsAccessSupported: boolean;
  addFiles: (files: FileList | File[]) => Promise<number>;
  pickFiles: () => Promise<number>;
  pickDirectory: () => Promise<number>;
  lastCount: number;
}

export function useMusicLoader(): UseMusicLoader {
  const [state, setState] = useState<LoaderState>({
    loading: false,
    lastError: null,
    lastCount: 0,
  });

  const fsAccessSupported = isFileSystemAccessSupported();

  const ingestPicked = useCallback(
    async (picked: { file: File; handle: FileSystemFileHandle | null }[]): Promise<number> => {
      const tracks: Track[] = [];
      const registry = getFileRegistry();
      for (const { file, handle } of picked) {
        if (!isAudioFile(file)) continue;
        registry.register(file);
        const meta = await extractMetadata(file);
        const id = makeTrackId(file);
        registry.registerById(id, file);
        const track = toTrack(file, meta, Boolean(handle));
        tracks.push(track);
        if (handle) {
          try {
            await saveHandle(id, handle, file.name);
          } catch {
            // ignore persistence failures
          }
        }
      }
      if (tracks.length > 0) {
        useMusicStore.getState().addTracks(tracks);
        await saveTracks(tracks);
      }
      return tracks.length;
    },
    [],
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      setState((s) => ({ ...s, loading: true, lastError: null }));
      try {
        const list = Array.from(files).map((file) => ({ file, handle: null }));
        const count = await ingestPicked(list);
        setState({ loading: false, lastError: null, lastCount: count });
        return count;
      } catch (error) {
        const message = (error as Error).message ?? 'Error cargando archivos';
        setState((s) => ({ ...s, loading: false, lastError: message }));
        return 0;
      }
    },
    [ingestPicked],
  );

  const pickFiles = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, lastError: null }));
    try {
      const picked = await pickWithFileSystemAccess({ multiple: true });
      if (picked.length === 0) {
        setState((s) => ({ ...s, loading: false }));
        return 0;
      }
      const count = await ingestPicked(picked);
      setState({ loading: false, lastError: null, lastCount: count });
      return count;
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        lastError: (error as Error).message ?? 'Error abriendo selector',
      }));
      return 0;
    }
  }, [ingestPicked]);

  const pickDirectory = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, lastError: null }));
    try {
      const picked = await pickWithFileSystemAccess({ directory: true });
      if (picked.length === 0) {
        setState((s) => ({ ...s, loading: false }));
        return 0;
      }
      const count = await ingestPicked(picked);
      setState({ loading: false, lastError: null, lastCount: count });
      return count;
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        lastError: (error as Error).message ?? 'Error abriendo carpeta',
      }));
      return 0;
    }
  }, [ingestPicked]);

  return {
    loading: state.loading,
    error: state.lastError,
    fsAccessSupported,
    addFiles,
    pickFiles,
    pickDirectory,
    lastCount: state.lastCount,
  };
}