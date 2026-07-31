export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as unknown as { showOpenFilePicker?: unknown }).showOpenFilePicker === 'function'
  );
}

export function isDirectoryPickerSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as unknown as { showDirectoryPicker?: unknown }).showDirectoryPicker === 'function'
  );
}

export interface PickerOptions {
  multiple?: boolean;
  directory?: boolean;
}

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

export interface PickedFile {
  file: File;
  handle: FileSystemFileHandle | null;
}

const ACCEPTED_AUDIO: FilePickerAcceptType = {
  description: 'Audio',
  accept: {
    'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'],
  },
};

export async function pickWithFileSystemAccess(
  options: PickerOptions = {},
): Promise<PickedFile[]> {
  const out: PickedFile[] = [];
  if (typeof window === 'undefined') return out;

  try {
    if (options.directory) {
      const dirHandle = await (
        window as unknown as {
          showDirectoryPicker: (opts?: { mode?: 'read' | 'readwrite' }) => Promise<FileSystemDirectoryHandle>;
        }
      ).showDirectoryPicker({ mode: 'read' });
      await collectFromDirectory(dirHandle, out);
      return out;
    }

    const supportsFilePicker = isFileSystemAccessSupported();
    if (supportsFilePicker) {
      const handles = await (
        window as unknown as {
          showOpenFilePicker: (opts?: {
            multiple?: boolean;
            types?: FilePickerAcceptType[];
            excludeAcceptAllOption?: boolean;
          }) => Promise<FileSystemFileHandle[]>;
        }
      ).showOpenFilePicker({
        multiple: options.multiple ?? true,
        types: [ACCEPTED_AUDIO],
        excludeAcceptAllOption: false,
      });

      for (const handle of handles) {
        try {
          const file = await handle.getFile();
          if (isAudioFile(file)) out.push({ file, handle });
        } catch {
          // skip unreadable
        }
      }
    }
  } catch (error) {
    if ((error as { name?: string }).name === 'AbortError') return out;
    throw error;
  }

  return out;
}

async function collectFromDirectory(
  dirHandle: FileSystemDirectoryHandle,
  out: PickedFile[],
): Promise<void> {
  const handle = dirHandle as unknown as {
    values: () => AsyncIterableIterator<FileSystemHandle>;
  };
  for await (const entry of handle.values()) {
    if (entry.kind === 'file') {
      if (!isAudioName(entry.name)) continue;
      try {
        const file = await (entry as FileSystemFileHandle).getFile();
        if (isAudioFile(file)) out.push({ file, handle: entry as FileSystemFileHandle });
      } catch {
        // skip
      }
    } else if (entry.kind === 'directory') {
      await collectFromDirectory(entry as FileSystemDirectoryHandle, out);
    }
  }
}

const AUDIO_EXT = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

export function isAudioName(name: string): boolean {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  return AUDIO_EXT.includes(ext);
}

export function isAudioFile(file: File): boolean {
  if (file.type && file.type.startsWith('audio/')) return true;
  return isAudioName(file.name);
}