import type { CameraFacingMode } from '@modules/assistant/types';

export interface CameraConstraints {
  deviceId?: string;
  facingMode: CameraFacingMode;
}

export async function requestCameraStream(
  constraints: CameraConstraints,
): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw Object.assign(new Error('API de cámara no soportada'), { name: 'TypeError' });
  }

  const base: MediaTrackConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  if (constraints.deviceId) {
    return navigator.mediaDevices.getUserMedia({
      video: { ...base, deviceId: { exact: constraints.deviceId } },
      audio: false,
    });
  }

  return navigator.mediaDevices.getUserMedia({
    video: { ...base, facingMode: { ideal: constraints.facingMode } },
    audio: false,
  });
}

export function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.isSecureContext) return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}