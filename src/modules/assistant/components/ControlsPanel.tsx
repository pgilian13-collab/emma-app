import { motion } from 'framer-motion';
import { Button } from '@components/ui/Button';
import {
  FiEye,
  FiEyeOff,
  FiGrid,
  FiLock,
  FiUnlock,
  FiRotateCw,
  FiMaximize2,
  FiRefreshCw,
  FiTrash2,
  FiCamera,
} from 'react-icons/fi';
import type { OverlayTransform } from '@modules/assistant/types';

interface ControlsPanelProps {
  hasImage: boolean;
  locked: boolean;
  showControls: boolean;
  showGrid: boolean;
  transform: OverlayTransform;
  devicesCount: number;
  onOpacityChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onRotateChange: (value: number) => void;
  onReset: () => void;
  onClear: () => void;
  onToggleLock: () => void;
  onToggleControls: () => void;
  onToggleGrid: () => void;
  onToggleFacing: () => void;
  language: 'es' | 'en';
}

export function ControlsPanel({
  hasImage,
  locked,
  showControls,
  showGrid,
  transform,
  devicesCount,
  onOpacityChange,
  onScaleChange,
  onRotateChange,
  onReset,
  onClear,
  onToggleLock,
  onToggleControls,
  onToggleGrid,
  onToggleFacing,
  language,
}: ControlsPanelProps) {
  const es = language === 'es';
  const labels = {
    title: es ? 'Controles' : 'Controls',
    visibility: es ? 'Visibilidad' : 'Visibility',
    opacity: es ? 'Transparencia' : 'Opacity',
    scale: es ? 'Escala' : 'Scale',
    rotation: es ? 'Rotación' : 'Rotation',
    lock: es ? 'Bloquear overlay' : 'Lock overlay',
    unlock: es ? 'Desbloquear overlay' : 'Unlock overlay',
    reset: es ? 'Restablecer' : 'Reset',
    clear: es ? 'Eliminar imagen' : 'Remove image',
    flip: es ? 'Girar cámara' : 'Flip camera',
    grid: es ? 'Cuadrícula' : 'Grid',
    hide: es ? 'Ocultar panel' : 'Hide panel',
    show: es ? 'Mostrar panel' : 'Show panel',
    cameras: es ? 'Cámaras disponibles' : 'Available cameras',
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="panel-card flex w-full flex-col gap-5 p-5 lg:w-80 lg:shrink-0"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white/40">
          {labels.title}
        </h3>
        <button
          onClick={onToggleControls}
          aria-label={showControls ? labels.hide : labels.show}
          className="focus-ring rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
        >
          {showControls ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>

      {showControls ? (
        <>
          <div className="space-y-4">
            <Slider
              label={labels.opacity}
              value={transform.opacity}
              min={0}
              max={1}
              step={0.01}
              onChange={onOpacityChange}
              format={(v) => `${Math.round(v * 100)}%`}
              disabled={!hasImage}
            />
            <Slider
              label={labels.scale}
              value={transform.scaleX}
              min={0.1}
              max={4}
              step={0.01}
              onChange={onScaleChange}
              format={(v) => `${v.toFixed(2)}x`}
              disabled={!hasImage}
            />
            <Slider
              label={labels.rotation}
              value={transform.angle}
              min={-180}
              max={180}
              step={1}
              onChange={onRotateChange}
              format={(v) => `${Math.round(v)}°`}
              disabled={!hasImage}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={locked ? <FiUnlock size={14} /> : <FiLock size={14} />}
              onClick={onToggleLock}
              disabled={!hasImage}
            >
              {locked ? labels.unlock : labels.lock}
            </Button>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<FiRefreshCw size={14} />}
              onClick={onReset}
              disabled={!hasImage}
            >
              {labels.reset}
            </Button>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<FiMaximize2 size={14} />}
              onClick={() => onScaleChange(1)}
              disabled={!hasImage}
            >
              {es ? '1:1' : 'Fit'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<FiRotateCw size={14} />}
              onClick={() => onRotateChange(0)}
              disabled={!hasImage}
            >
              {es ? '0°' : '0°'}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            fullWidth
            leftIcon={<FiTrash2 size={14} />}
            onClick={onClear}
            disabled={!hasImage}
            className="text-red-300 hover:bg-red-500/10"
          >
            {labels.clear}
          </Button>

          <div className="h-px bg-white/5" />

          <div className="flex flex-col gap-2">
            <button
              onClick={onToggleGrid}
              className={`focus-ring flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${
                showGrid
                  ? 'border-primary bg-primary/15 text-white'
                  : 'border-white/10 bg-panel text-white/70 hover:bg-panelLight'
              }`}
            >
              <span className="flex items-center gap-2">
                <FiGrid size={14} />
                {labels.grid}
              </span>
              <span
                className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-all ${
                  showGrid ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white transition-transform ${
                    showGrid ? 'translate-x-4' : ''
                  }`}
                />
              </span>
            </button>

            <button
              onClick={onToggleFacing}
              className="focus-ring flex items-center justify-between rounded-xl border border-white/10 bg-panel px-3 py-2 text-sm text-white/70 transition-all hover:bg-panelLight"
            >
              <span className="flex items-center gap-2">
                <FiCamera size={14} />
                {labels.flip}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                {devicesCount > 0 ? `${devicesCount}` : '—'}
              </span>
            </button>
          </div>
        </>
      ) : null}
    </motion.aside>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  disabled?: boolean;
}

function Slider({ label, value, min, max, step, onChange, format, disabled }: SliderProps) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <div className={disabled ? 'pointer-events-none opacity-40' : ''}>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-white/70">{label}</label>
        <span className="text-xs font-semibold tabular-nums text-primary-light">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-primary"
        style={{
          background: `linear-gradient(to right, #8B5CF6 0%, #EC4899 ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
    </div>
  );
}