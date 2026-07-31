import type { Track } from '@modules/music/types';

const DB_NAME = 'emma-music';
const DB_VERSION = 1;
const HANDLES_STORE = 'handles';
const TRACKS_STORE = 'tracks';

interface StoredHandle {
  id: string;
  handle: unknown;
  fileName: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(HANDLES_STORE)) {
        db.createObjectStore(HANDLES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(TRACKS_STORE)) {
        db.createObjectStore(TRACKS_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB error'));
  });
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  work: (objectStore: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(store, mode);
        const objectStore = transaction.objectStore(store);
        const request = work(objectStore);
        transaction.oncomplete = () => {
          if (request && 'result' in request) {
            resolve(request.result as T);
          } else {
            resolve(undefined as unknown as T);
          }
        };
        transaction.onerror = () => reject(transaction.error ?? new Error('IDB tx error'));
        transaction.onabort = () => reject(transaction.error ?? new Error('IDB tx aborted'));
      }),
  );
}

export async function saveHandle(trackId: string, handle: unknown, fileName: string): Promise<void> {
  const entry: StoredHandle = { id: trackId, handle, fileName };
  await tx(HANDLES_STORE, 'readwrite', (store) => store.put(entry));
}

export async function loadHandle(trackId: string): Promise<StoredHandle | null> {
  return tx<StoredHandle | undefined>(HANDLES_STORE, 'readonly', (store) =>
    store.get(trackId) as IDBRequest<StoredHandle | undefined>,
  ).then((entry) => entry ?? null);
}

export async function deleteHandle(trackId: string): Promise<void> {
  await tx(HANDLES_STORE, 'readwrite', (store) => store.delete(trackId));
}

export async function listStoredTracks(): Promise<Track[]> {
  const all = await tx<Track[]>(TRACKS_STORE, 'readonly', (store) =>
    store.getAll() as IDBRequest<Track[]>,
  );
  return all ?? [];
}

export async function saveTrack(track: Track): Promise<void> {
  await tx(TRACKS_STORE, 'readwrite', (store) => store.put(track));
}

export async function saveTracks(tracks: Track[]): Promise<void> {
  if (tracks.length === 0) return;
  await tx(TRACKS_STORE, 'readwrite', (store) => {
    for (const track of tracks) {
      store.put(track);
    }
  });
}

export async function deleteTrack(trackId: string): Promise<void> {
  await Promise.all([
    tx(TRACKS_STORE, 'readwrite', (store) => store.delete(trackId)),
    tx(HANDLES_STORE, 'readwrite', (store) => store.delete(trackId)),
  ]);
}

export async function clearMusicStorage(): Promise<void> {
  await Promise.all([
    tx(TRACKS_STORE, 'readwrite', (store) => store.clear()),
    tx(HANDLES_STORE, 'readwrite', (store) => store.clear()),
  ]);
}

interface FileSystemFileHandleLike {
  getFile: () => Promise<File>;
  queryPermission?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<'granted' | 'prompt' | 'denied'>;
  requestPermission?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<'granted' | 'prompt' | 'denied'>;
}

export function isFileSystemHandle(value: unknown): value is FileSystemFileHandleLike {
  return (
    !!value &&
    typeof value === 'object' &&
    'getFile' in value &&
    typeof (value as { getFile: unknown }).getFile === 'function'
  );
}

export async function ensureHandlePermission(handle: FileSystemFileHandleLike): Promise<boolean> {
  if (!handle.queryPermission) return true;
  const status = await handle.queryPermission({ mode: 'read' });
  if (status === 'granted') return true;
  if (!handle.requestPermission) return false;
  const next = await handle.requestPermission({ mode: 'read' });
  return next === 'granted';
}

export async function readFileFromHandle(handle: unknown): Promise<File | null> {
  if (!isFileSystemHandle(handle)) return null;
  try {
    const ok = await ensureHandlePermission(handle);
    if (!ok) return null;
    return await handle.getFile();
  } catch {
    return null;
  }
}