import type { CameraDevice, CameraFacingMode, CameraErrorCode } from '@modules/assistant/types';

const STORAGE_KEY = 'emma-assistant-preferences';

export interface StoredPreferences {
  showControls: boolean;
  showGrid: boolean;
  locked: boolean;
  lastImageName: string | null;
  lastTransform: {
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
    angle: number;
    opacity: number;
  } | null;
  preferredFacingMode: CameraFacingMode;
  preferredDeviceId: string | null;
}

const DEFAULTS: StoredPreferences = {
  showControls: true,
  showGrid: false,
  locked: false,
  lastImageName: null,
  lastTransform: null,
  preferredFacingMode: 'environment',
  preferredDeviceId: null,
};

export function readPreferences(): StoredPreferences {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<StoredPreferences>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function writePreferences(prefs: StoredPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota errors
  }
}

export function resetPreferences(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function mapErrorCode(error: unknown): CameraErrorCode {
  if (!(error instanceof Error) && typeof error !== 'object') return 'unknown';
  const name = (error as { name?: string }).name ?? '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'permission-denied';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'not-found';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'not-readable';
    case 'TypeError':
      return 'insecure-context';
    default:
      return 'unknown';
  }
}

export async function enumerateCameras(): Promise<CameraDevice[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === 'videoinput')
      .map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `Cámara ${index + 1}`,
      }));
  } catch {
    return [];
  }
}

export function isMediaSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}