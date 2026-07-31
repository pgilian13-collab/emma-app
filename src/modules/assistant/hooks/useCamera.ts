import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraErrorCode, CameraFacingMode, CameraState } from '@modules/assistant/types';
import {
  enumerateCameras,
  isMediaSupported,
  mapErrorCode,
} from '@modules/assistant/services/preferencesService';
import {
  isSecureContext,
  requestCameraStream,
  stopMediaStream,
} from '@modules/assistant/services/cameraService';

const INITIAL_STATE: CameraState = {
  stream: null,
  devices: [],
  activeDeviceId: null,
  status: 'idle',
  error: null,
  facingMode: 'environment',
};

export interface UseCameraOptions {
  preferredFacingMode?: CameraFacingMode;
  preferredDeviceId?: string | null;
}

export function useCamera(options: UseCameraOptions = {}) {
  const { preferredFacingMode = 'environment', preferredDeviceId = null } = options;
  const [state, setState] = useState<CameraState>({
    ...INITIAL_STATE,
    facingMode: preferredFacingMode,
  });
  const activeRequest = useRef(0);

  const start = useCallback(
    async (override?: { deviceId?: string; facingMode?: CameraFacingMode }) => {
      if (!isMediaSupported() || !isSecureContext()) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: !isSecureContext() ? 'insecure-context' : 'unsupported',
        }));
        return;
      }

      activeRequest.current += 1;
      const requestId = activeRequest.current;

      setState((prev) => ({ ...prev, status: 'requesting', error: null }));

      const deviceId = override?.deviceId ?? preferredDeviceId ?? undefined;
      const facingMode = override?.facingMode ?? preferredFacingMode;

      try {
        const stream = await requestCameraStream({ deviceId, facingMode });
        if (requestId !== activeRequest.current) {
          stopMediaStream(stream);
          return;
        }
        const devices = await enumerateCameras();
        const trackSettings = stream.getVideoTracks()[0]?.getSettings();
        const activeDeviceId =
          trackSettings?.deviceId ?? deviceId ?? devices[0]?.deviceId ?? null;

        setState({
          stream,
          devices,
          activeDeviceId,
          status: 'ready',
          error: null,
          facingMode,
        });
      } catch (error) {
        if (requestId !== activeRequest.current) return;
        const code: CameraErrorCode = mapErrorCode(error);
        setState((prev) => ({ ...prev, status: 'error', error: code }));
      }
    },
    [preferredDeviceId, preferredFacingMode],
  );

  const stop = useCallback(() => {
    activeRequest.current += 1;
    setState((prev) => {
      stopMediaStream(prev.stream);
      return { ...prev, stream: null, status: 'idle' };
    });
  }, []);

  const switchDevice = useCallback(
    async (deviceId: string) => {
      await start({ deviceId });
    },
    [start],
  );

  const toggleFacing = useCallback(async () => {
    const next: CameraFacingMode = state.facingMode === 'environment' ? 'user' : 'environment';
    await start({ facingMode: next });
  }, [state.facingMode, start]);

  useEffect(() => {
    const devices = state.devices;
    if (devices.length === 0) return;
    const handler = () => {
      enumerateCameras().then((next) => setState((prev) => ({ ...prev, devices: next })));
    };
    navigator.mediaDevices.addEventListener('devicechange', handler);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handler);
  }, [state.devices.length]);

  useEffect(() => {
    return () => {
      activeRequest.current += 1;
      stopMediaStream(state.stream);
    };
  }, [state.stream]);

  return { state, start, stop, switchDevice, toggleFacing };
}