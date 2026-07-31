import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface CameraViewProps {
  stream: MediaStream | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  mirrored: boolean;
}

export function CameraView({ stream, videoRef, mirrored }: CameraViewProps) {
  const lastStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (videoRef.current && stream && lastStream.current !== stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => undefined);
      lastStream.current = stream;
    }
    if (!stream) {
      lastStream.current = null;
    }
  }, [stream, videoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className={`h-full w-full object-cover ${mirrored ? '-scale-x-100' : ''}`}
    />
  );
}