import { motion } from 'framer-motion';
import { FiCameraOff } from 'react-icons/fi';
import { CameraView } from './CameraView';
import { OverlayCanvas } from './OverlayCanvas';
import { GridOverlay } from './GridOverlay';
import { ControlsPanel } from './ControlsPanel';
import { FilePicker } from './FilePicker';
import { Button } from '@components/ui/Button';
import type { OverlayTransform } from '@modules/assistant/types';
import type { RefObject } from 'react';

interface ActiveStageProps {
  imageUrl: string | null;
  imageName: string | null;
  showControls: boolean;
  showGrid: boolean;
  locked: boolean;
  transform: OverlayTransform;
  cameraStream: MediaStream | null;
  cameraFacing: 'user' | 'environment';
  videoRef: RefObject<HTMLVideoElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  devicesCount: number;
  onTransformChange: (patch: Partial<OverlayTransform>) => void;
  onOpacityChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onRotateChange: (value: number) => void;
  onReset: () => void;
  onClearImage: () => void;
  onToggleLock: () => void;
  onToggleControls: () => void;
  onToggleGrid: () => void;
  onToggleFacing: () => void;
  onStopCamera: () => void;
  onSelectImage: (dataUrl: string, name: string) => void;
  language: 'es' | 'en';
}

export function ActiveStage({
  imageUrl,
  imageName,
  showControls,
  showGrid,
  locked,
  transform,
  cameraStream,
  cameraFacing,
  videoRef,
  containerRef,
  canvasRef,
  devicesCount,
  onTransformChange,
  onOpacityChange,
  onScaleChange,
  onRotateChange,
  onReset,
  onClearImage,
  onToggleLock,
  onToggleControls,
  onToggleGrid,
  onToggleFacing,
  onStopCamera,
  onSelectImage,
  language,
}: ActiveStageProps) {
  const es = language === 'es';
  const mirrored = cameraFacing === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 lg:flex-row"
    >
      <div className="panel-card relative flex-1 overflow-hidden">
        <div ref={containerRef} className="relative aspect-video w-full bg-black/40">
          <CameraView stream={cameraStream} videoRef={videoRef} mirrored={mirrored} />
          <OverlayCanvas
            canvasRef={canvasRef}
            containerRef={containerRef}
            imageUrl={imageUrl}
            transform={transform}
            locked={locked}
            onTransformChange={onTransformChange}
          />
          {showGrid ? <GridOverlay /> : null}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
              {es ? 'En vivo' : 'Live'}
            </span>
            {locked ? (
              <span className="rounded-full bg-primary/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                {es ? 'Bloqueado' : 'Locked'}
              </span>
            ) : null}
          </div>

          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={onToggleFacing}
              aria-label={es ? 'Girar cámara' : 'Flip camera'}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            >
              <CameraIcon flipped={mirrored} />
            </button>
            <button
              onClick={onStopCamera}
              aria-label={es ? 'Detener cámara' : 'Stop camera'}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-red-500/70"
            >
              <FiCameraOff size={14} />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onStopCamera}
              className="bg-black/60 backdrop-blur"
            >
              {es ? '← Volver a la imagen' : '← Back to image'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <FilePicker
            imageUrl={imageUrl}
            imageName={imageName}
            onSelect={onSelectImage}
            onClear={onClearImage}
            language={language}
          />
          <p className="text-[11px] text-white/40">
            {es
              ? 'Arrastra las esquinas del overlay para escalar.'
              : 'Drag the overlay corners to scale.'}
          </p>
        </div>
      </div>

      <ControlsPanel
        hasImage={!!imageUrl}
        locked={locked}
        showControls={showControls}
        showGrid={showGrid}
        transform={transform}
        devicesCount={devicesCount}
        onOpacityChange={onOpacityChange}
        onScaleChange={onScaleChange}
        onRotateChange={onRotateChange}
        onReset={onReset}
        onClear={onClearImage}
        onToggleLock={onToggleLock}
        onToggleControls={onToggleControls}
        onToggleGrid={onToggleGrid}
        onToggleFacing={onToggleFacing}
        language={language}
      />
    </motion.div>
  );
}

function CameraIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
      aria-hidden
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}