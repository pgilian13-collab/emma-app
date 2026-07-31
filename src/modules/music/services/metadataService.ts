import jsmediatags from 'jsmediatags';
import type { TagType } from 'jsmediatags/types';
import type { Track } from '@modules/music/types';

const ID3_ALBUM_COVER = new Set([
  'APIC',
  'PIC',
  'coverart',
]);

export interface ExtractedMetadata {
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverDataUrl: string | null;
}

function readTag(tags: Record<string, unknown>, key: string): string | null {
  const entry = tags[key];
  if (!entry || typeof entry !== 'object') return null;
  const data = (entry as { data?: unknown }).data;
  if (typeof data === 'string') return data.trim() || null;
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
    return String(data[0]).trim() || null;
  }
  return null;
}

function readCover(tags: Record<string, unknown>): string | null {
  for (const key of Object.keys(tags)) {
    if (!ID3_ALBUM_COVER.has(key)) continue;
    const entry = tags[key] as { data?: unknown; format?: string } | undefined;
    if (!entry) continue;
    const data = entry.data;
    if (!(data instanceof ArrayBuffer)) continue;
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    const mime = entry.format?.includes('png') ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${btoa(binary)}`;
  }
  return null;
}

function deriveTitleFromFilename(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  const base = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
  return base.replace(/[_-]+/g, ' ').trim() || fileName;
}

export function parseFilename(fileName: string): { artist: string; title: string } {
  const base = fileName.replace(/\.[^.]+$/, '');
  const separators = [' - ', ' – ', ' — ', '_-_', ' _ '];
  for (const sep of separators) {
    if (base.includes(sep)) {
      const [artist, ...rest] = base.split(sep);
      return {
        artist: (artist ?? '').trim(),
        title: rest.join(sep).trim(),
      };
    }
  }
  return { artist: '', title: base };
}

function probeDuration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = url;
    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.removeAttribute('src');
      audio.load();
    };
    const finish = (value: number) => {
      cleanup();
      resolve(Number.isFinite(value) && value > 0 ? value : 0);
    };
    audio.addEventListener('loadedmetadata', () => finish(audio.duration));
    audio.addEventListener('error', () => finish(0));
    setTimeout(() => finish(audio.duration || 0), 4000);
  });
}

export async function extractMetadata(
  file: File,
  fallbackTitle?: string,
): Promise<ExtractedMetadata> {
  const parsed = parseFilename(file.name);
  const fallback: ExtractedMetadata = {
    title: fallbackTitle ?? (parsed.title || deriveTitleFromFilename(file.name)),
    artist: parsed.artist || 'Artista desconocido',
    album: 'Álbum desconocido',
    duration: await probeDuration(file),
    coverDataUrl: null,
  };

  try {
    const result = await new Promise<TagType | null>((resolve) => {
      jsmediatags.read(file, {
        onSuccess: (tag) => resolve(tag),
        onError: () => resolve(null),
      });
    });
    if (!result) return fallback;

    const tags = (result.tags ?? {}) as Record<string, unknown>;
    const title = readTag(tags, 'title');
    const artist = readTag(tags, 'artist');
    const album = readTag(tags, 'album');
    const cover = readCover(tags);

    return {
      title: title ?? fallback.title,
      artist: artist ?? fallback.artist,
      album: album ?? fallback.album,
      duration: fallback.duration,
      coverDataUrl: cover,
    };
  } catch {
    return fallback;
  }
}

export function makeTrackId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function toTrack(file: File, meta: ExtractedMetadata, hasHandle: boolean): Track {
  const id = makeTrackId(file);
  return {
    id,
    name: meta.title,
    artist: meta.artist,
    album: meta.album,
    duration: meta.duration,
    coverDataUrl: meta.coverDataUrl,
    fileName: file.name,
    mimeType: file.type || 'audio/*',
    size: file.size,
    hasHandle,
    createdAt: Date.now(),
  };
}