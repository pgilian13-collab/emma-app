export interface OverlayTransform {
  left: number;
  top: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  opacity: number;
}

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export type CameraFacingMode = 'environment' | 'user';

export type CameraErrorCode =
  | 'permission-denied'
  | 'not-found'
  | 'not-readable'
  | 'overconstrained'
  | 'insecure-context'
  | 'unsupported'
  | 'unknown';

export interface CameraState {
  stream: MediaStream | null;
  devices: CameraDevice[];
  activeDeviceId: string | null;
  status: 'idle' | 'requesting' | 'ready' | 'error';
  error: CameraErrorCode | null;
  facingMode: CameraFacingMode;
}

export interface AssistantPreferences {
  showControls: boolean;
  showGrid: boolean;
  locked: boolean;
  lastImageName: string | null;
  lastTransform: OverlayTransform | null;
}