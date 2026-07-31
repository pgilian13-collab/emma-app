import { useEffect, useRef, useState } from 'react';
import { useCamera } from '@modules/assistant/hooks/useCamera';
import { useOverlayTransform } from '@modules/assistant/hooks/useOverlayTransform';
import { useAssistantPrefs } from '@modules/assistant/hooks/useAssistantPrefs';
import { ImportStep } from './ImportStep';
import { ActiveStage } from './ActiveStage';
import { PermissionGate } from './PermissionGate';
import { useSettingsStore } from '@store/settingsStore';
import type { OverlayTransform } from '@modules/assistant/types';

type Stage = 'import' | 'active';

export function AssistantWorkspace() {
  const language = useSettingsStore((state) => state.language);

  const { state, start, stop, toggleFacing } = useCamera({
    preferredFacingMode: 'environment',
  });

  const [stage, setStage] = useState<Stage>('import');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  const { showControls, showGrid, setShowControls, setShowGrid } = useAssistantPrefs();
  const { transform, locked, update, reset, clear, toggleLock } = useOverlayTransform({
    lastImageName: imageName,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === 'import') {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const handleSelectImage = (dataUrl: string, name: string) => {
    if (imageUrl && imageUrl !== dataUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(dataUrl);
    setImageName(name);
  };

  const handleClearImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageName(null);
    clear();
    setStage('import');
  };

  const handleStartCamera = () => {
    setStage('active');
    void start();
  };

  const handleStopCamera = () => {
    stop();
    setStage('import');
  };

  const handleTransformChange = (next: Partial<OverlayTransform>) => {
    update(next);
  };

  if (stage === 'import') {
    return (
      <ImportStep
        imageUrl={imageUrl}
        imageName={imageName}
        cameraState={state}
        onSelectImage={handleSelectImage}
        onClearImage={handleClearImage}
        onStartCamera={handleStartCamera}
        language={language}
      />
    );
  }

  return (
    <PermissionGate
      status={state.status}
      error={state.error}
      onRequest={() => void start()}
      onRetry={() => void start()}
      language={language}
    >
      <ActiveStage
        imageUrl={imageUrl}
        imageName={imageName}
        showControls={showControls}
        showGrid={showGrid}
        locked={locked}
        transform={transform}
        cameraStream={state.stream}
        cameraFacing={state.facingMode}
        videoRef={videoRef}
        containerRef={containerRef}
        canvasRef={canvasRef}
        devicesCount={state.devices.length}
        onTransformChange={handleTransformChange}
        onOpacityChange={(value) => update({ opacity: value })}
        onScaleChange={(value) => update({ scaleX: value, scaleY: value })}
        onRotateChange={(value) => update({ angle: value })}
        onReset={reset}
        onClearImage={handleClearImage}
        onToggleLock={toggleLock}
        onToggleControls={() => setShowControls(!showControls)}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleFacing={() => void toggleFacing()}
        onStopCamera={handleStopCamera}
        onSelectImage={handleSelectImage}
        language={language}
      />
    </PermissionGate>
  );
}